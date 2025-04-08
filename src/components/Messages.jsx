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

  let headerDisplayed = false; 
  let lastDate = "";

  // state for tracking today's message header:
  // const [lastDate, setLastDate] = useState("");
  // const [dateHeaderShown, setDateHeaderShown] = useState(false);
  // let lastDate = "";

  useEffect(() => {
    bottomDiv.current.scrollIntoView({ behavior: "smooth" }); // auto-scrolling to the last div, whenever messages-list changes
  }, [messages.length]);

  // main function for showing all types of messages, emojis, gifs, files etc.:
  function showMessage(message) {
    const uniqueId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    if (!message || !message.member) {
      console.log("Invalid message or member:", message);
      return null;
    }

    const { member, data, id, timestamp } = message;

    // format time: HH:MM
    function formatTime(timest) {
      const date = new Date(timest * 1000); // to milisec.
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
    }

    // format date: DD.MM.YYYY
    function formatDate(timest) {
      const date = new Date(timest * 1000);
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
    }

    // function formatDate(timest) {
    //   const date = new Date(timest * 1000);
    //   return date.toLocaleDateString('en-GB');
    // }

    // check if a message was sent today:
    function isToday(timest) {
      const messageDate = new Date(timest * 1000);
      const today = new Date();
      return (
        messageDate.getDate() === today.getDate() &&
        messageDate.getMonth() === today.getMonth() &&
        messageDate.getFullYear() === today.getFullYear()
      );
    }

    let dateHeader = null;
    const messageDate = formatDate(timestamp);

    let listItem;


    // only show 'Today' header once:
    // if (isToday(timestamp) && !dateHeaderShown) {
    //   dateHeader = <li key="today"><div className="date-header">Today</div></li>;
    //   setDateHeaderShown(true);
    // } else if (!isToday(timestamp) && lastDate !== messageDate) {
    //   dateHeader = <li key={messageDate}><div className="date-header">{messageDate}</div></li>;
    //   setLastDate(messageDate); 
    // }

    if (isToday(timestamp) && !headerDisplayed) {
      dateHeader = <li key={`header-today-${uniqueId}`}><div className="date-header">Today {messageDate}</div></li>;
      headerDisplayed = true;
    }
    // Render date header for previous days
    else if (!isToday(timestamp) && lastDate !== messageDate) {
      dateHeader = <li key={`header-today-${uniqueId}`}><div className="date-header">{messageDate}</div></li>;
      lastDate = messageDate;
    }

    // css-classes for different types of messages in chat:
    const messageClass =
      data.type === "user-joined"
        ? "user-joined"
        : data.type === "user-left"
        ? "user-left"
        : data.type === "user-message"
        ? "user-message"
        : "";


    if (!member) {
      console.warn("Member is null or undefined:", message);
      // handle system messages / other cases where member is missing
      return (
        <li key={uniqueId}>
          <div>
            {/* <div className={messageClass}>{data.text}</div> */}
            <div
              className={`${messageClass} ${
                member.id === thisMember.id ? "message-from-me" : ""
              }`}
            >
              {data.text}
            </div>
          </div>
        </li>
      );
    }

    // NEW:

    // if (member === thisMember)

    if (sameMember !== member.id) {
      listItem = (
        <li
          key={uniqueId}
          data-id={member.id}
          className={`${member.id === thisMember.id ? "list-item-right" : ""}`}
        >
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
          {/* {data.text.startsWith("http") && data.text.includes(".gif") ? (
            <img src={data.text} alt="GIF" className="gif-message" />
          ) : (
            <div className={messageClass}>{data.text}</div>
          )} */}
          {data.text.startsWith("http") && data.text.includes(".gif") ? (
            <img src={data.text} alt="GIF" className="gif-message" />
          ) : data.text.startsWith("http") &&
            data.text.includes(".supabase.co") ? (
            // <div className={messageClass}>
            <div
              className={`${messageClass} ${
                member.id === thisMember.id ? "message-from-me" : ""
              }`}
            >
              {data.text.includes(",") ? (
                (() => {
                  const [fileLink, shortenedLink] = data.text.split(",");
                  return (
                    <>
                      <a
                        href={fileLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="file-link"
                      >
                        Uploaded file:{" "}
                        <span className="file-link-supabase">
                          {shortenedLink}
                        </span>
                      </a>
                    </>
                  );
                })()
              ) : (
                <a
                  href={data.text}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="file-link"
                >
                  Uploaded file:{" "}
                  <span className="file-link-supabase">{data.text}</span>
                </a>
              )}
            </div>
          ) : (
            // <div className={messageClass}>{data.text}</div>
            <div
              className={`${messageClass} ${
                member.id === thisMember.id ? "message-from-me" : ""
              }`}
            >
              {data.text}
            </div>
          )}
        </li>
      );
      sameMember = member.id;
      // setting the 'sameMember' from initial "" to be the member who wrote this previous, 1st message
      // next time, it will check if (sameMember !== member.id) -> it will be false (double negative),
      // then it will jump to this 2nd, 'ELSE'-block (where it doesn't show avatar & usernama for each message):
    } else {
      listItem = (
        <li
          key={uniqueId}
          data-id={member.id}
          className={`${member.id === thisMember.id ? "list-item-right" : ""}`}
        >
          <div>
            <div className="timestamp">{formatTime(timestamp)}</div>

            {/* Check if the message is a gif URL */}
            {/* {data.text.startsWith("http") && data.text.includes(".gif") ? (
              <img src={data.text} alt="GIF" className="gif-message" />
            ) : (
              <div className={messageClass}>{data.text}</div>
            )} */}
            {data.text.startsWith("http") && data.text.includes(".gif") ? (
              <img src={data.text} alt="GIF" className="gif-message" />
            ) : data.text.startsWith("http") &&
              data.text.includes(".supabase.co") ? (
              <div
                className={`${messageClass} ${
                  member.id === thisMember.id ? "message-from-me" : ""
                }`}
              >
                {data.text.includes(",") ? (
                  (() => {
                    const [fileLink, shortenedLink] = data.text.split(",");
                    return (
                      <>
                        <a
                          href={fileLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="file-link"
                        >
                          Uploaded file:{" "}
                          <span className="file-link-supabase">
                            {shortenedLink}
                          </span>
                        </a>
                      </>
                    );
                  })()
                ) : (
                  <a
                    href={data.text}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="file-link"
                  >
                    Uploaded file:{" "}
                    <span className="file-link-supabase">{data.text}</span>
                  </a>
                )}
              </div>
            ) : (
              // <div className={messageClass}>{data.text}</div>
              <div
                className={`${messageClass} ${
                  member.id === thisMember.id ? "message-from-me" : ""
                }`}
              >
                {data.text}
              </div>
            )}
          </div>
        </li>
      );
      sameMember = member.id;
      // again, setting the 'sameMember' to be the member who wrote this previous message
    }

    // rendering system-notifications (who has joined or left chat):
    if (data.type === "user-left" || data.type === "user-joined") {
      listItem = (
        // <li key={id} data-id={member.id}>
        <li key={uniqueId}>
          <div>
            <div className={messageClass}>{data.text}</div>
          </div>
        </li>
      );
      sameMember = "";
      // reseting, to show avatar and username of members writing next message, including newcomer members
      // sameMember = member.id;  // this is not ok, then it's not showing avatar and username of newcomer members
    } // NEEDED! - without it, it shows avatar for each message from SAME user
    // it sets member.id to be same as message-author after each new message - the evaluation starts again

    // return listItem;
    return (
      <>
        {dateHeader}
        {listItem}
      </>
    );
  }

  ///////

  return (
    <>
      <ul className="messages-list">
        {/* {messages.map((message) => showMessage(message))} */}

        {messages.length > 0 ? (
          messages.map((message) => showMessage(message))
        ) : (
          <div>No messages to display</div>
        )}

        <div ref={bottomDiv}></div>
      </ul>

      <hr />
    </>
  );
}
