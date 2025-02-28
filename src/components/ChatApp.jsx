// main component, used for connection with Scaledrone chat-channel & starting chat

import { useState, useEffect, useRef } from "react";

import MessagesList from "./MessagesList";
import MembersList from "./MembersList";
import TypingIndicator from "./TypingIndicator";
import Input from "./Input";

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

let drone = 0;

// Scaledrone channel:
const CHANNEL = `${process.env.CHANNEL_ID}` || "{INSERT_CHANNEL_ID}";

export default function ChatApp() {
  // states:
  // const [user, setUser] = useState(null);
  // const [drone, setDrone] = useState(null);

  // let data="";

  // function connectToScaledrone() {
  //   const drone = new window.Scaledrone(CHANNEL, {
  //     data
  //   });
  // }

  // States:

  const [messages, setMessages] = useState([
    {
      // initial state is array, consisting of one message-object:
      id: "1",
      data: "Initial text message",
      // member: {
      //   id: "1",
      //   memberData: {
      //     color: "green",
      //     username: "testUser",
      //   },
      // },
    },
  ]);

  // to distinguish 'me' / "our user" from other members - specific state:
  const [me, setMe] = useState({
    username: randomName(),
    color: randomColor(),
  });

  const [members, setMembers] = useState([
    {
      id: "1",
      memberData: {
        color: "green",
        username: "testUser",
      },
    },
  ]);

  useEffect(() => {
    if (drone === null) {
      connectToScaledrone();
    }
  }, []);


  // helper-constants for connecting to Scaledrone:
  const messagesRef = useRef();
  messagesRef.current = messages;

  const membersRef = useRef();
  membersRef.current = members;

  const meRef = useRef();
  meRef.current = me;

  // function for connecting to Scaledrone - creates new Scaledrone-object (as part of the window-object):

  function connectToScaledrone() {
    drone = new window.Scaledrone(CHANNEL, {
      data: meRef.current,
    });
    drone.on('open', error => {
      if (error) {
        return console.error(error);
      }
      meRef.current.id = drone.clientId;
      setMe(meRef.current);
    });

    const room = drone.subscribe('observable-room');

    room.on('message', message => {
      const {data, member} = message;
      if (typeof data === 'object' && typeof data.typing === 'boolean') {
        const newMembers = [...membersRef.current];
        const index = newMembers.findIndex(m => m.id === member.id);
        newMembers[index].typing = data.typing;
        setMembers(newMembers);
      } else {
        setMessages([...messagesRef.current, message]);
      }
    });
    room.on('members', members => {
      setMembers(members);
    });
    room.on('member_join', member => {
      setMembers([...membersRef.current, member]);
    });
    room.on('member_leave', ({id}) => {
      const index = membersRef.current.findIndex(member => member.id === id);
      const newMembers = [...membersRef.current];
      newMembers.splice(index, 1);
      setMembers(newMembers);
    });
  }

  // functions for publishing messages which are endered in input-field:

  function onSendMessage(message) {
    drone.publish({
      room: "observable-room",
      message
    });
  }

  function onChangeTypingState(isTyping) {
    drone.publish({
      room: "observable-room",
      message: { typing: isTyping },
    });
  }

  return (
    <main>
      {/* style: app */}
      <div>
        {/* style: app-content */}
        <MembersList members={members} me={me} />
        {/* adding 2 states as prop-values for MessagesList-component: */}
        <MessagesList messages={messages} members={members} me={me} />
        {/* <Chat /> */}
        <TypingIndicator
          members={members.filter(
            (member) => member.typing && member.id !== me.id
          )}
        />
        <Input
          onSendMessage={onSendMessage}
          onChangeTypingState={onChangeTypingState}
        />
      </div>
    </main>
  );
}
