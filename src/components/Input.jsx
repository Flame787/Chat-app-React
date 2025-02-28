import { useState, useEffect } from "react";

import TypingIndicator from "./TypingIndicator";

let typingIndicator = null;

export default function Input({ onsendMessage, onChangeTypingState }) {
  const [text, setText] = useState();

  // useEffect for typing-indicator:
  useEffect(() => {
    if (typingIndicator === null) {
      typingIndicator = new TypingIndicator(); // creating new typingIndicator-object
      typingIndicator.listen(onChangeTypingState);
      // adding listener to the typing object, which activates function 'onChangeTypingState'
    }
  });

  function onChange(event) {
    const text = event.target.value;
    typingIndicator.onChange(text);
    setText(text);
  }

  function onSubmit(event) {
    event.preventDefault();
    setText("");   // clear previous message from input-field, once it was submitted
    onsendMessage(text);
  }

  return (
    <div>
      <form onSubmit={(event) => onSubmit(event)}>
        <input
          onChange={(event) => onChange(event)}
          value={text}
          type="text"
          placeholder="Enter your message and press Send"
          autoFocus
        />
        <button>Send</button>
      </form>
    </div>
  );
}
