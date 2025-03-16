import { useState, useEffect, useRef } from "react";

export default function Messages({ messages, thisMember }) {
  //thisMember - the person from whose perspective we are currently seing the chat (user-perspective)

  // let sameMember = "";
  // if continuos messages from same user, we don't show his username & avatar for each message

  const bottomDiv = useRef();
  // empty div under all messages - when new message arrives, the page scrolls to the last message (= to this div)

  //NEW:
  // const sameMemberRef = useRef("");

  useEffect(() => {
    bottomDiv.current.scrollIntoView({ behavior: "smooth" }); // auto-scrolling to the last div, whenever messages-list changes
  }, [messages.length]);

  let sameMember = "";

  function showMessage(message) {
    const { member, data, id } = message;

    let listItem;

    // css-classes for different types of messages in chat:
    const messageClass =
      data.type === "user-joined"
        ? "user-joined"
        : data.type === "user-left"
        ? "user-left"
        : data.type === "user-message"
        ? "user-message"
        : "";

    if (sameMember !== member.id) {
      listItem = (
        <li key={id} data-id={member.id}>
          <div>
            <img
              src={`/avatars/${member.clientData.avatar}`}
              alt="user-avatar"
              className="avatar-image"
            />
            <div className="username">{member.clientData.username}</div>
            <div className={messageClass}>{data.text}</div>
          </div>
        </li>
      );

      // sameMemberRef.current = member.id;  // NEEDED! - without it, it shows avatar for each message from SAME user
    
    } else {
      listItem = (
        <li key={id} data-id={member.id}>
          <div>
            <div className={messageClass}>{data.text}</div>
          </div>
        </li>
      );
    }

    // rendering system-notifications (who has joined or left chat):
    if (data.type === "user-left" || data.type === "user-joined") {
      listItem = (
        <li key={id} data-id={member.id}>
          <div>
            <div className={messageClass}>{data.text}</div>
          </div>
        </li>
      );
    }

    return listItem;
  }

  ///////

  return (
    <ul className="messages-list">
      {messages.map((message) => showMessage(message))}
      <div ref={bottomDiv}></div>
    </ul>
  );
}
