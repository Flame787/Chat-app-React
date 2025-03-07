import { useState } from "react";

export default function Registration({ onFormSubmit }) {
  const [username, setUsername] = useState("");

  //   const [room, setRoom] = useState("");

  const getUsername = (e) => {
    setUsername(e.target.value);
  };

  const submitForm = (e) => {
    e.preventDefault();
    onFormSubmit(username);  // Register username
   
  };

  return (
    <div>
      <form onSubmit={submitForm} name="reg-form">
        <input
          type="text"
          placeholder="Enter name..."
          required
          onChange={getUsername}
        />

        <button type="submit">Start chat</button>
      </form>
    </div>
  );
}
