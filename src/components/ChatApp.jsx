// main component, used for connection with Scaledrone chat-channel & starting chat

import { useState, useEffect, useRef } from "react";

import MessagesList from "./MessagesList";
import Members from "./Members";

// function that creates a new random username:
function randomName() {
  const adjectives = [
    'autumn', 'hidden', 'bitter', 'misty', 'silent', 'empty', 'dry', 'dark',
    'summer', 'icy', 'delicate', 'quiet', 'white', 'cool', 'spring', 'winter',
    'patient', 'twilight', 'dawn', 'crimson', 'wispy', 'weathered', 'blue',
    'billowing', 'broken', 'cold', 'damp', 'falling', 'frosty', 'green', 'long',
    'late', 'lingering', 'bold', 'little', 'morning', 'muddy', 'old', 'red',
    'rough', 'still', 'small', 'sparkling', 'shy', 'wandering',
    'withered', 'wild', 'black', 'young', 'holy', 'solitary', 'fragrant',
    'aged', 'snowy', 'proud', 'floral', 'restless', 'divine', 'polished',
    'ancient', 'purple', 'lively', 'nameless'
  ];
  const nouns = [
    'waterfall', 'river', 'breeze', 'moon', 'rain', 'wind', 'sea', 'morning',
    'snow', 'lake', 'sunset', 'pine', 'shadow', 'leaf', 'dawn', 'glitter',
    'forest', 'hill', 'cloud', 'meadow', 'sun', 'glade', 'bird', 'brook',
    'butterfly', 'bush', 'dew', 'dust', 'field', 'fire', 'flower', 'firefly',
    'feather', 'grass', 'haze', 'mountain', 'night', 'pond', 'darkness',
    'snowflake', 'silence', 'sound', 'sky', 'shape', 'surf', 'thunder',
    'violet', 'water', 'wildflower', 'wave', 'water', 'resonance', 'sun',
    'wood', 'dream', 'cherry', 'tree', 'fog', 'frost', 'voice', 'paper', 'frog',
    'smoke', 'star'
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
  return '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16);
}

let drone = 0;

// Scaledrone channel:
const CHANNEL = `${process.env.CHANNEL_ID}` || "{INSERT_CHANNEL_ID}";

export default function ChatApp() {
  // states:
  const [user, setUser] = useState(null);
  const [drone, setDrone] = useState(null);

  let data="";

  function connectToScaledrone() {
    const drone = new window.Scaledrone(CHANNEL, {
      data
    });
  }

  return (
    <main>   
      {/* style: app */}
  <div>
    {/* style: app-content */}
    <Members />
    <MessagesList />
    {/* <Chat /> */}
    </div>
    </main>);
}
