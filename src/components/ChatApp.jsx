// Main component, used for connection with Scaledrone chat-channel & starting chat

import { useState, useEffect, useRef } from "react";

import Messages from "./Messages";
import Input from "./Input";
import Loader from "./Loader";
import Registration from "./Registration";
import HeaderRegistration from "./HeaderRegistration";
import HeaderChat from "./HeaderChat";

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

  let lastMessage = chat.messages[chat.messages.length - 1];
  console.log("lastMessage: ", lastMessage);

  // function for connecting to Scaledrone - whenever new member comes, he gets connected to Scaledrone:

  useEffect(() => {
    if (chat.member.username !== "") {
      const drone = new window.Scaledrone(CHANNEL, {
        data: chat.member,
      });
      setDrone(drone);
    }
  }, [chat.member]);
  // when user enters/gets his username and avatar/color, a new Scaledrone instance of object is created.
  // This new instance becomes/sets new drone-state.

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

        room.on("message", (message) => {
          chat.messages.push(message);
          setChat({ ...chat }, chat.messages);
          console.log("all chat-messages:", chat.messages);
        });

       

        // NEW:
        room.on("member_leave", (member) => {
          console.log(`${member.clientData.username} has left the chat`);
          drone.publish({
            room: "observable-room",
            message: {
              text: `${member.clientData.username} has left the chat.`,
              type: "user-left",
            },
          });
        });
      });
      drone.on("error", (error) => console.log(error));
    }
  }, [chat, drone]);

  // when Scaledrone instance is created, it tries to connect to a chat-room.
  // When connection opens (drone.on("open")), a clientId for user is generated, user enters the room, and
  // if connection was succesfull, roomloaded get's to 'true'.
  // Now the room can receive messages. When new message comes, it's added to chat.messages-list,
  // and chat-state is changed, and component re-renders.

  function sendMessage(message) {
    drone.publish({
      room: "observable-room",
      message: {
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
      <div>
        <HeaderChat />
        <Messages messages={chat.messages} thisMember={chat.member} />

        <Input sendMessage={sendMessage} />
      </div>
    </div>
  );
}
