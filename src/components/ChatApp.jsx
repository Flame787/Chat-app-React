// main component, used for connection with Scaledrone chat-channel & starting chat

import { useState, useEffect, useRef } from "react";

// import MessagesList from "./MessagesList";
// import MembersList from "./MembersList";
// import TypingIndicator from "./TypingIndicator";

// import Loader
// import Header
import Messages from "./Messages";
import Input from "./Input";
import Loader from "./Loader";
import Registration from "./Registration";

// function that creates a new random username:
function randomName() {
  const adjectives = [
    "autumn",
    "hidden",
    "bitter",
    "misty",
    "silent",
    "empty",
    "dry",
    "dark",
    "summer",
    "icy",
    "delicate",
    "quiet",
    "white",
    "cool",
    "spring",
    "winter",
    "patient",
    "twilight",
    "dawn",
    "crimson",
    "wispy",
    "weathered",
    "blue",
    "billowing",
    "broken",
    "cold",
    "damp",
    "falling",
    "frosty",
    "green",
    "long",
    "late",
    "lingering",
    "bold",
    "little",
    "morning",
    "muddy",
    "old",
    "red",
    "rough",
    "still",
    "small",
    "sparkling",
    "shy",
    "wandering",
    "withered",
    "wild",
    "black",
    "young",
    "holy",
    "solitary",
    "fragrant",
    "aged",
    "snowy",
    "proud",
    "floral",
    "restless",
    "divine",
    "polished",
    "ancient",
    "purple",
    "lively",
    "nameless",
  ];
  const nouns = [
    "waterfall",
    "river",
    "breeze",
    "moon",
    "rain",
    "wind",
    "sea",
    "morning",
    "snow",
    "lake",
    "sunset",
    "pine",
    "shadow",
    "leaf",
    "dawn",
    "glitter",
    "forest",
    "hill",
    "cloud",
    "meadow",
    "sun",
    "glade",
    "bird",
    "brook",
    "butterfly",
    "bush",
    "dew",
    "dust",
    "field",
    "fire",
    "flower",
    "firefly",
    "feather",
    "grass",
    "haze",
    "mountain",
    "night",
    "pond",
    "darkness",
    "snowflake",
    "silence",
    "sound",
    "sky",
    "shape",
    "surf",
    "thunder",
    "violet",
    "water",
    "wildflower",
    "wave",
    "water",
    "resonance",
    "sun",
    "wood",
    "dream",
    "cherry",
    "tree",
    "fog",
    "frost",
    "voice",
    "paper",
    "frog",
    "smoke",
    "star",
  ];

  // a function which finds one random adjective, based on a randomized index-number between all items of the array:
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];

  // a function which finds one random noun, same principle as before:
  const noun = nouns[Math.floor(Math.random() * nouns.length)];

  // string-concatination -> new random username is created:
  return adjective + noun;
}

// function that creates a new random color (random hex-number):
function randomColor() {
  return "#" + Math.floor(Math.random() * 0xffffff).toString(16);
}

// Scaledrone channel:
// const CHANNEL = `${process.env.CHANNEL_ID}` || "{YdfwYv0JH0iFXUck}";

const CHANNEL = process.env.REACT_APP_CHANNEL_ID
  ? process.env.REACT_APP_CHANNEL_ID
  : "Enter your chat-channel ID";

export default function ChatApp() {
  // States:

  const [chat, setChat] = useState({
    member: { username: "" },
    messages: [],
  });

  const [drone, setDrone] = useState(null);

  const [roomLoaded, setRoomLoaded] = useState(false);

  // function for connecting to Scaledrone:

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
          }
        });
        room.on("message", (message) => {
          chat.messages.push(message);
          setChat({ ...chat }, chat.messages);
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
      message,
    });
  }

  function handleRegistration(username) {
    chat.member = {
      username: username,
    };
    setChat({ ...chat }, chat.member);
  }

  return chat.member.username === "" ? (
    <Registration onFormSubmit={handleRegistration} />
  ) : !roomLoaded ? (
    // <Loader />
    <div>
      <img src="../public/loading_circles.jpg" alt="loading-icon" />   
      <div>Loading...</div>
    </div>
  ) : (
    <div>
      {/* <Header /> */}
      <Messages messages={chat.messages} thisMember={chat.member} />
      <Input sendMessage={sendMessage} />
    </div>
  );
}
