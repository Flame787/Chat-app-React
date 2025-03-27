import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import { faFaceSmile } from "@fortawesome/free-solid-svg-icons";

export default function Input({ sendMessage, thisMember }) {
  // thisMember - me / the person from whose perspective we are currently seing the chat (user-perspective)
  // = chat.member; has properties: username & avatar

  const placeholder = [
    "Enter your message...",
    "You need to type something first...",
  ];

  const initialInput = {
    text: "",
    placeholder: placeholder[0],
  };

  // states:

  const [input, setInput] = useState(initialInput);

  let nameInput;

  function updateInput(e) {
    setInput({ ...input, text: e.target.value });
  }

  function publishInput(e) {
    e.preventDefault();
    if (input.text === "") {
      setInput({
        ...input,
        placeholder: placeholder[1],
      });
    } else {
      sendMessage(input.text);
      setInput({ text: "", placeholder: placeholder[0] });
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      publishInput(e);
    }
  };

  return (
    <div className="input-down">
      <form onSubmit={publishInput} className="flex-message">
        <div className="my-avatar-name">
          <img
            src={`/avatars/${thisMember.avatar}`}
            alt="user-avatar"
            title={`${thisMember.username} (me)`}
            className="avatar-image"
          />
          <div className="input-name">{`${thisMember.username} (me)`}</div>
        </div>
        <div className="message-input">
          <input
            className="input-text"
            value={input.text}
            type="text"
            placeholder={input.placeholder}
            ref={(input) => {
              nameInput = input;
            }}
            autoFocus={true}
            onChange={updateInput}
            onKeyDown={handleKeyDown}
          />
          {/* <input
          className="file-input"
          type="file"
          id="file-input"
          multiple
          accept="image/*,application/pdf,text/plain"
          onChange={updateInput}
          onKeyDown={handleKeyDown}
        ></input> */}

          <div className="buttons">
            <button className="input-button smiley-button" type="button">
              <FontAwesomeIcon icon={faFaceSmile} />
            </button>
            <button
              className="input-button send-button"
              type="button"
              onMouseDown={publishInput}
            >
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
