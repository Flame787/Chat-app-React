import { useState, useEffect } from "react";

export default function Input({ sendMessage }) {
  const placeholder = [
    "Enter your message...",
    "You need to type something first..."
  ];

  const initialInput = {
    text: "",
    placeholder: placeholder[0]
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
        placeholder: placeholder[1]
      });
    } else {
      sendMessage(input.text);
      setInput({ text: "", placeholder: placeholder[0] });
    }
  }

  return (
    <div>
      <form onSubmit={publishInput}>
      <input
          className="msg-form__input"
          value={input.text}
          type="text"
          placeholder={input.placeholder}
          ref={(input) => {
            nameInput = input;
          }}
          autoFocus={true}
          onChange={updateInput}

        />
      <button
          type="button"
          onMouseDown={publishInput}
        >
          Send
        </button>
      </form>
    </div>
  )

}