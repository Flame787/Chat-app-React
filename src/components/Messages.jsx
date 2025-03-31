import { useState, useEffect, useRef } from "react";

export default function Messages({ messages, thisMember }) {
  //thisMember - the person from whose perspective we are currently seing the chat (user-perspective)

  let sameMember = "";
  // variable which tracks the ID of the member, who has last published a message in chat.
  // If another member with different ID publishes a message, then sameMember gets this new ID, and component also
  // displays the avatar and username of this "different" member.
  // But if a message comes from same user as before, we don't show his username & avatar for each message.

  const bottomDiv = useRef();
  // empty div under all messages - when new message arrives, the page scrolls to the last message (= to this div)

  useEffect(() => {
    bottomDiv.current.scrollIntoView({ behavior: "smooth" }); // auto-scrolling to the last div, whenever messages-list changes
  }, [messages.length]);

  function showMessage(message) {
    const { member, data, id, timestamp } = message;

    function formatTime(timest) {
      const date = new Date(timest * 1000); // to milisec.
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
    }

    if (!member) {
      console.warn("Member is null or undefined:", message);
      // Handle system messages / other cases where member is missing
      return (
        <li key={id}>
          <div>
            <div className={messageClass}>{data.text}</div>
          </div>
        </li>
      );
    }

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
          <div className="who-wrote">
            <img
              src={`/avatars/${member.clientData.avatar}`}
              alt="user-avatar"
              title={` avatar: ${member.clientData.username}`}
              className="avatar-image"
            />
            <div className="username">{member.clientData.username}</div>
          </div>
          <div className="timestamp">{formatTime(timestamp)}</div>

          {/* Check if the message is a gif-URL */}
          {data.text.startsWith("http") && data.text.includes(".gif") ? (
            <img src={data.text} alt="GIF" className="gif-message" />
          ) : (
            <div className={messageClass}>{data.text}</div>
          )}
        </li>
      );
      sameMember = member.id; // here needed to reset to the same value
    } else {
      listItem = (
        <li key={id} data-id={member.id}>
          <div>
            <div className="timestamp">{formatTime(timestamp)}</div>

            {/* Check if the message is a gif URL */}
            {data.text.startsWith("http") && data.text.includes(".gif") ? (
              <img src={data.text} alt="GIF" className="gif-message" />
            ) : (
              <div className={messageClass}>{data.text}</div>
            )}
            
          </div>
        </li>
      );
      sameMember = member.id; // and here needed to reset to the same value
    }

    // rendering system-notifications (who has joined or left chat):
    if (data.type === "user-left" || data.type === "user-joined") {
      listItem = (
        // <li key={id} data-id={member.id}>
        <li key={id}>
          <div>
            <div className={messageClass}>{data.text}</div>
          </div>
        </li>
      );
      sameMember = ""; // this is correct, showing avatar and username of newcomer members
      // sameMember = member.id;  // this is not ok, then it's not showing avatar and username of newcomer members
    } // NEEDED! - without it, it shows avatar for each message from SAME user
    // it sets member.id to be same as message author after each new message - the evaluation starts again

    // console.log("listItem:", listItem);

    return listItem;
  }

  ///////

  return (
    <>
      <ul className="messages-list">
        {messages.map((message) => showMessage(message))}
        <div ref={bottomDiv}></div>
      </ul>
      <hr />
    </>
  );
}
