import { useState, useEffect, useRef } from "react";

export default function Messages({ messages, thisMember }) {
//thisMember - the person from whose perspective we are currently seing the chat (user-perspective)

  let sameMember = "";
  // if continuos messages from same user, we don't show his username & avatar for each message

  const bottomDiv = useRef();
  // empty div under all messages - when new message arrives, the page scrolls to the last message (= to this div)

  useEffect(() => {
    bottomDiv.current.scrollIntoView(); // auto-scrolling to the last div, whenever messages-list changes
  }, [messages.length]);

  function showMessage(message) {
    const { member, data, id } = message;

    let listItem;

    sameMember !== member.id
      ? (listItem = (
          <li key={id} data-id={member.id}>
            <div>
            {/* <img
                  src={member.clientData.avatar}
                  alt="user-avatar"
                /> */}
              <div>{member.clientData.username}</div>
              
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
