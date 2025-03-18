import { useState } from "react";

export default function Registration({ onFormSubmit }) {
  const [username, setUsername] = useState("");

  const [selectedAvatar, setSelectedAvatar] = useState("");

  //   const [room, setRoom] = useState("");

  // list of avatars from public/avatars folder:
  const avatars = [
    "avatar1.png",
    "avatar2.png",
    "avatar3.png",
    "avatar4.png",
    "avatar5.png",
    "avatar6.png",
    "avatar7.png",
    "avatar8.png",
  ];

  const getUsername = (e) => {
    setUsername(e.target.value);
  };

  // const getAvatar = (e) => {
  //   setAvatar(e.target.value);
  // };

  const selectAvatar = (avatar) => {
    setSelectedAvatar(avatar);
  };

  const submitForm = (e) => {
    e.preventDefault();
    if (!selectedAvatar) {
      alert("Please select an avatar!");
      return;
    }
    onFormSubmit(username, selectedAvatar); // register with username and also send avatar
  };

  return (
    <div className="flex-div-reg">
      <form onSubmit={submitForm} name="reg-form" className="registration-form">
        <div className="flexbox-baseline">
          <label className="registration-label">Username:</label>
          <input
            className="input-username"
            type="text"
            placeholder="Enter name..."
            required
            onChange={getUsername}
          />
        </div>

        <div>
          <div className="flexbox-baseline">
            <label className="registration-label">Select your avatar:</label>
          </div>
          <div className="avatar-select flex-registration">
            {avatars.map((avatar, index) => (
              <img
                key={index}
                src={`/avatars/${avatar}`}
                alt={`Avatar ${index + 1}`}
                className={
                  selectedAvatar === avatar
                    ? "avatar-image selected"
                    : "avatar-image"
                }
                onClick={() => selectAvatar(avatar)}
              />
            ))}
          </div>
        </div>

        <div className="flexbox-baseline">
          <button className="registration-button" type="submit">
            Start chat
          </button>
        </div>
      </form>
    </div>
  );
}
