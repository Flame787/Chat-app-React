// main component, used for connection with Scaledrone chat-channel & starting chat

import { useState } from "react";
// import Chat from ...

// Scaledrone channel:
const CHANNEL = `${process.env.CHANNEL_ID}` || "{INSERT_CHANNEL_ID}";

export default function ChatApp() {
  // states:
  const [user, setUser] = useState(null);
  const [drone, setDrone] = useState(null);

  let data=""

  function connectToScaledrone() {
    const drone = new window.Scaledrone(CHANNEL, {
      data
    });
  }

  return <div>{/* <Chat /> */}</div>;
}
