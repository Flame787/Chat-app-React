// Main component, used for connection with Scaledrone chat-channel & starting chat

import { useState, useEffect, useRef } from "react";

import Messages from "./Messages";
import Input from "./Input";
import Loader from "./Loader";
import Registration from "./Registration";
import HeaderRegistration from "./HeaderRegistration";
import HeaderChat from "./HeaderChat";
import ScrollToBottom from "./ScrollToBottom";
import MembersCount from "./MembersCount";

const CHANNEL = process.env.REACT_APP_CHANNEL_ID
  ? process.env.REACT_APP_CHANNEL_ID
  : "Enter your chat-channel ID";

export default function ChatApp() {
  // States:

  const [chat, setChat] = useState({
    member: { username: "", avatar: "" },
    messages: [],
  });

  const [drone, setDrone] = useState(null);

  const [roomLoaded, setRoomLoaded] = useState(false);

  const [members, setMembers] = useState([]);

  // function for saving messages to local history:

  function saveMessages(message) {
    const messages = JSON.parse(localStorage.getItem("chatMessages")) || [];
    const exists = messages.some((msg) => msg.id === message.id);
    if (!exists) {
      const uniqueId = `${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      message.id = message.id || uniqueId;
      messages.push(message);

      if (messages.length > 20) {
        messages.shift();
      }

      localStorage.setItem("chatMessages", JSON.stringify(messages));
    }
  }

  // function for fetching previous 20 messages at loading the app:

  // useEffect(() => {
  //   const prevMessages = JSON.parse(localStorage.getItem("chatMessages")) || [];
  //   setChat((prevChat) => ({
  //     ...prevChat,
  //     messages: prevMessages,
  //   }));
  // }, []);

  useEffect(() => {
    const prevMessages = JSON.parse(localStorage.getItem("chatMessages")) || [];
    const filteredMessages = prevMessages.filter(
      (msg, index, self) => self.findIndex((m) => m.id === msg.id) === index
    );

    setChat((prevChat) => ({
      ...prevChat,
      messages: [...prevChat.messages, ...filteredMessages],
    }));
  }, []);

  // useEffect(() => {
  //   const prevMessages = JSON.parse(localStorage.getItem("chatMessages")) || [];
  //   setChat((prevChat) => ({
  //     ...prevChat,
  //     messages: [...new Set([...prevChat.messages, ...prevMessages])], // Merge without duplicates
  //   }));
  // }, []);

  // useEffect(() => {
  //   if (message) {
  //     const prevMessages = JSON.parse(localStorage.getItem("chatMessages")) || [];
  //     setChat((prevChat) => ({
  //       ...prevChat,
  //       messages: [...prevMessages, message],  // Appending new message
  //     }));
  //     saveMessages(message);  // Save message to localStorage
  //   }
  // }, [message]);

  // function for connecting to Scaledrone - whenever new member comes, he gets connected to Scaledrone:

  useEffect(() => {
    if (chat.member.username !== "") {
      const drone = new window.Scaledrone(CHANNEL, {
        data: chat.member,
      });
      setDrone(drone);
    }
  }, [chat.member]);
  // when user enters/gets his username and avatar, a new Scaledrone instance of object is created.
  // When Scaledrone instance is created, it tries to connect to a chat-room.
  // This new instance becomes/sets new drone-state.
  // When connection opens (drone.on("open")), a clientId for user is generated, user enters the room, and
  // if connection was succesfull, roomloaded get's to 'true'.
  // Then the room can receive messages. When new message comes, it's added to chat.messages-list,
  // also chat-state is changed, and component re-renders.
  // *Each user has it's own drone and it's own different (shorter/larger) chat.messages - list.
  // *(by default: messages are not all visible for all members; users who join the room later don't see previous messages)

  useEffect(() => {
    if (drone && !chat.member.id) {
      drone.on("open", (error) => {
        if (error) {
          return console.error(error);
        }
        chat.member.id = drone.clientId;
        setChat({ ...chat }, chat.member);

        const room = drone.subscribe("observable-room");

        room.on("open", (error) => {
          if (error) {
            console.error(error);
          } else {
            console.log("Connected to room");
            setRoomLoaded(true);
            drone.publish({
              room: "observable-room",
              message: {
                text: `${chat.member.username} has joined the chat.`,
                type: "user-joined",
              },
            });
          }
        });

        // List of currently online members, emitted once
        room.on("members", (m) => {
          setMembers(m);
          console.log("All members of this chat:", members);
        });

        room.on("member_join", (newMember) => {
          setMembers((prev) => [...prev, newMember]);
        });

        // room.on("message", (message) => {
        //   chat.messages.push(message);
        //   setChat({ ...chat }, chat.messages);
        //   console.log("all chat-messages:", chat.messages);

        //   saveMessages(message);
        //   console.log("Message saved: ", message);
        // });

        room.on("message", (message) => {
          const exists = chat.messages.some((msg) => msg.id === message.id);

          if (!exists) {
            chat.messages.push(message);
            setChat({ ...chat, messages: chat.messages });
            saveMessages(message);
          }
        });

        // NEW 18.03.:
        // Each user has their own drone instance and their own message list (chat.messages).This would cause
        // duplicate notifications on member_leave event, because notifications are sent from & to all members.
        // To avoid that EACH user sends a notification (duplicates), we are using filtering logic in the member_leave event.
        // The idea: the list of members updates (one who left is removed), all members receive the message on that,
        // but only ONE member actually sends this message/info - only the member with currently Minimal client ID.

        room.on("member_leave", (member) => {
          setMembers((prevMembers) => {
            const updatedMembers = prevMembers.filter(
              (m) => m.id !== member.id
            );

            console.log("Updated members list after leave:", updatedMembers);

            // Sorting IDs alfanumerically:
            const sortedMembers = updatedMembers.sort((a, b) =>
              a.id.localeCompare(b.id)
            );

            // Minimal ID will be 1st in the sorted list:
            const minClientId = sortedMembers[0].id;

            console.log("Minimal client ID:", minClientId);

            if (drone.clientId === minClientId) {
              drone.publish({
                room: "observable-room",
                message: {
                  text: `${member.clientData.username} has left the chat.`,
                  type: "user-left",
                },
              });
            }

            return updatedMembers;
          });
        });
      });

      drone.on("error", (error) => console.log(error));
    }
  }, [chat, drone]);

  function sendMessage(message) {
    drone.publish({
      room: "observable-room",
      message: {
        // id: Date.now().toString(),
        text: message,
        type: "user-message",
      },
    });
  }

  function handleRegistration(username, selectedAvatar) {
    chat.member = {
      username: username,
      avatar: selectedAvatar,
    };
    setChat({ ...chat }, chat.member);
  }

  return chat.member.username === "" ? (
    <div>
      <HeaderRegistration />
      <Registration onFormSubmit={handleRegistration} />
    </div>
  ) : !roomLoaded ? (
    <div>
      <HeaderChat />
      <Loader />
    </div>
  ) : (
    <div>
      <HeaderChat />
      <MembersCount members={members} />
      <ScrollToBottom />
      <div className="messages-input-div">
        <Messages messages={chat.messages} thisMember={chat.member} />

        <Input sendMessage={sendMessage} thisMember={chat.member} />
      </div>
    </div>
  );
}
