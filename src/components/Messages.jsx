import { useState, useEffect, useRef } from "react";

export default function Messages({ messages, thisMember }) {
  let sameMember = "";
  // if continuos messages from same user, we don't show his username & avatar for each message
  const bottomDiv = useRef();
  
  useEffect(() => {
    bottomDiv.current.scrollIntoView();
  }, [messages.length]);

  function showMessage(message) {
    const { member, data, id } = message;

    let listItem;

    sameMember !== member.id
      ? (listItem = (
          <li key={id} data-id={member.id}>
            <div>
              <div>{data}</div>
              <div></div>
            </div>
          </li>
          //   add username and avatar / color
        ))
      : (listItem = (
          <li key={id} data-id={member.id}>
            <div>
              <div>{data}</div>
              <div></div>
            </div>
          </li>
        ));

    sameMember = member.id;
    return listItem;
  }

  return (
    <ul>
      {messages.map((message) => showMessage(message))}
      <div ref={bottomDiv}></div>
    </ul>
  );
}
