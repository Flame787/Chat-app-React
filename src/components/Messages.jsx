import { useState, useEffect, useRef } from "react";

export default function Messages({ messages, thisMember }) {
  //thisMember - the person from whose perspective we are currently seing the chat (user-perspective)

  // let sameMember = "";
  // if continuos messages from same user, we don't show his username & avatar for each message

  const bottomDiv = useRef();
  // empty div under all messages - when new message arrives, the page scrolls to the last message (= to this div)

  //NEW:
  const sameMemberRef = useRef("");

  useEffect(() => {
    bottomDiv.current.scrollIntoView(); // auto-scrolling to the last div, whenever messages-list changes
  }, [messages.length]);

  function showMessage(message) {
    const { member, data, id } = message;

    // const messageClass = messages.type === "user-joined" ? "user-joined" : "";

    const messageClass =
      message.data.type === "user-joined"
        ? "user-joined"
        : message.data.type === "user-left"
        ? "user-left"
        : message.data.type === "user-message"
        ? "user-message"
        : "";

    // console.log("messageClass:", messageClass);

    let listItem;

    if (message.data.type === "user-left" || message.data.type === "user-joined")
      { listItem = (
          <li key={id} data-id={member.id}>
            <div>
              <div className={messageClass}>{data.text}</div>
              <div></div>
            </div>
          </li>
        )
      } else if (sameMemberRef.current !== member.id) {
       (listItem = (
          <li key={id} data-id={member.id}>
            <div>
              <img
                src={`/avatars/${member.clientData.avatar}`}
                alt="user-avatar"
                className="avatar-image"
              />
              <div className="username">{member.clientData.username}</div>

              <div className={messageClass}>{data.text}</div>
              <div></div>
            </div>
          </li>
          
        ))
      } else (listItem = (
          <li key={id} data-id={member.id}>
            <div>
              <div className={messageClass}>{data.text}</div>
              <div></div>
            </div>
          </li>
        ));

    // sameMember = member.id;

    sameMemberRef.current = member.id; 
    return listItem;
  }

  return (
    <ul className="messages-list">
      {messages.map((message) => showMessage(message))}
      <div ref={bottomDiv}></div>
    </ul>
  );
}
