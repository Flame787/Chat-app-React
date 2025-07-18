// Main component, used for connection with Scaledrone chat-channel & starting chat

import { useState, useEffect } from "react";

import Messages from "./Messages";
import Input from "./Input";
import Loader from "./Loader";
import Registration from "./Registration";
import HeaderRegistration from "./HeaderRegistration";
import HeaderChat from "./HeaderChat";
import ScrollToBottom from "./ScrollToBottom";
import MembersCount from "./MembersCount";

// const CHANNEL = process.env.REACT_APP_CHANNEL_ID
//   ? process.env.REACT_APP_CHANNEL_ID
//   : "Enter your chat-channel ID";

export default function ChatApp() {
  // States:

  const [chat, setChat] = useState({
    // member: { username: "", avatar: "" },
    member: { username: "", avatar: "", room: "" },
    messages: [],
  });

  const [drone, setDrone] = useState(null);

  const [roomLoaded, setRoomLoaded] = useState(false);

  const [members, setMembers] = useState([]);

  const [activeRoom, setActiveRoom] = useState(null);

  // NEW - with Netlify serverless functions:
  const [channelId, setChannelId] = useState(null);

  const fetchSecrets = async () => {
    try {
      const response = await fetch("/.netlify/functions/useKeys");
      const data = await response.json();
      setChannelId(data.droneChannelId);
    } catch (error) {
      console.error("Error while fetching Scaledrone channel ID:", error);
    }
  };

  useEffect(() => {
    fetchSecrets();
  }, []);

  // function for saving messages to local storage:
  function saveMessages(message) {
    // fetching all messages in local storage:

    // const messages = JSON.parse(localStorage.getItem("chatMessages")) || [];
    const roomKey = `chatMessages-${chat.member.room}`;
    const messages = JSON.parse(localStorage.getItem(roomKey)) || [];

    // checking if message with the same id already exists (prevents duplicates):
    const exists = messages.some((msg) => msg.id === message.id);
    // if no other message with the same id, pushing new message to the list:
    if (!exists) {
      // formula for creating a unique id, if the message doesn't have it already:
      const uniqueId = `${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      // result example: "1712500123456-4fzyo82gp"
      message.id = message.id || uniqueId;
      messages.push(message);
      // limited to previous 20 messages (if total number of messages exceeds 20, 1st message in array is removed):
      if (messages.length > 20) {
        messages.shift();
      }
      // saving new messages-array into local storage, under the name "chatMessages":
      // localStorage.setItem("chatMessages", JSON.stringify(messages));
      localStorage.setItem(roomKey, JSON.stringify(messages));
    }
  }

  // function for fetching previous 20 messages when loading the chat-room (when user enters chat):

  useEffect(() => {
    // fetching previous messages from local storage:
    // const prevMessages = JSON.parse(localStorage.getItem("chatMessages")) || [];

    const roomKey = `chatMessages-${chat.member.room}`;
    const prevMessages = JSON.parse(localStorage.getItem(roomKey)) || [];

    // filtering messages based on unique id, to remove duplicates (if message accidentally gets saved 2x):
    const filteredMessages = prevMessages.filter(
      (msg, index, self) => self.findIndex((m) => m.id === msg.id) === index
    );

    // updating chat-state - adding filtered messages from local storage:
    setChat((prevChat) => ({
      ...prevChat,
      messages: [...prevChat.messages, ...filteredMessages],
    }));
  }, [chat.member.room]);
  // effect takes place once - when component is mounted (when new user loggs into chat-room for the 1st time),
  // has no other dependencies
  // Corrected -> effect takes place each time a room changes.

  // function for connecting to Scaledrone - whenever new member comes, he gets connected to Scaledrone:
  useEffect(() => {
    if (chat.member.username !== "" && channelId) {
      const drone = new window.Scaledrone(channelId, {
        data: chat.member,
      });
      setDrone(drone);
    }
  }, [chat.member, channelId]);
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

        // const room = drone.subscribe("observable-room");
        const room = drone.subscribe(`observable-${chat.member.room}`);
        setActiveRoom(room);

        room.on("open", (error) => {
          if (error) {
            console.error(error);
          } else {
            console.log("Connected to room");
            setRoomLoaded(true);
            drone.publish({
              // room: "observable-room",
              room: `observable-${chat.member.room}`,
              message: {
                text: `${chat.member.username} has joined the chat.`,
                type: "user-joined",
              },
            });
          }
        });

        // list of currently online members:
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
                // room: "observable-room",
                room: `observable-${chat.member.room}`,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat, drone]);

  function sendMessage(message) {
    drone.publish({
      // room: "observable-room",
      room: `observable-${chat.member.room}`,
      message: {
        // id: Date.now().toString(),
        text: message,
        type: "user-message",
      },
    });
  }

  function handleRegistration(username, selectedAvatar, selectedRoom) {
    chat.member = {
      username: username,
      avatar: selectedAvatar,
      room: selectedRoom,
    };
    setChat({ ...chat }, chat.member);
  }

  function handleLogout() {
    if (drone && activeRoom) {
      const member = members.find((m) => m.id === drone.clientId);

      if (!member || !member.id) {
        console.error("Member ID is undefined. Unable to proceed with logout.");
        return; // exit if no valid member found
      }

      setMembers((prevMembers) => {
        const updatedMembers = prevMembers.filter((m) => m.id !== member.id);

        // sort IDs alphanumerically:
        const sortedMembers = updatedMembers.sort((a, b) =>
          a.id.localeCompare(b.id)
        );

        // minimal ID will be 1st in the sorted list:
        const minClientId = sortedMembers[0]?.id;

        if (drone.clientId === minClientId) {
          drone.publish({
            // room: "observable-room",
            room: `observable-${chat.member.room}`,
            message: {
              text: `${member.clientData.username} has left the chat.`,
              type: "user-left",
            },
          });
        }

        return updatedMembers;
      });

      // disconnect the user from the drone-instance:
      drone.close();

      // activeRoom.unsubscribe();  // this would just disconnect the user from the room

      // clear the chat-state for the current user:
      setChat({
        member: { username: "", avatar: "" },
        messages: [],
      });

      setRoomLoaded(false);
      setActiveRoom(null);
      setDrone(null);

      console.log("User has logged out.");
    }
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
      <HeaderChat onLogout={handleLogout} room={chat.member.room} />
      <MembersCount members={members} />

      <ScrollToBottom />
      <div className="messages-input-div">
        <Messages messages={chat.messages} thisMember={chat.member} />

        <Input sendMessage={sendMessage} thisMember={chat.member} />
      </div>
    </div>
  );
}
