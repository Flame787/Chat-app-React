import { useEffect, useRef } from "react";

import Message from "./Message";

export default function MessagesList({ messages, me }) {
  const scrollDownRef = useRef(null);

  useEffect(() => {
    // define action to scroll donw to the last message each time a new message appears 
    // (empty <div> after last message on the list is refferenced via useRef):
    if (scrollDownRef && scrollDownRef.current) {
      scrollDownRef.current.scrollIntoView({ behavior: "smooth" });
    }
  });     // no dependencies, function gets called each time the component is rendered

  // component returns a list of messages (with text and user-name & avatar):
  return (
    <ul>
      {messages.map((message) => <Message message={message} me={me} />)}
      <div ref={scrollDownRef}></div>    
    </ul>
  );
}
