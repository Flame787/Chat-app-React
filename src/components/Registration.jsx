import { useState } from "react";
import Select from "react-select";

export default function Registration({ onFormSubmit }) {
  const [username, setUsername] = useState("");

  const [selectedAvatar, setSelectedAvatar] = useState("");

  // NEW - different chat-rooms:
  const [room, setRoom] = useState("");

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

  const roomOptions = [
    { value: "💻 Tech", label: "💻 Tech" },
    { value: "🏝️ Travel", label: "🏝️ Travel" },
    { value: "🎵 Music", label: "🎵 Music" },
    { value: "⚽️ Sports", label: "⚽️ Sports" },
    { value: "👨‍💼 Business", label: "👨‍💼 Business" },
    { value: "📖 Education", label: "📖 Education" },
    { value: "😎 Chill-zone", label: "😎 Chill zone" },
  ];

  const getUsername = (e) => {
    setUsername(e.target.value);
  };

  const selectAvatar = (avatar) => {
    setSelectedAvatar(avatar);
  };

  // NEW:
  const getRoom = (selectedOption) => {
    setRoom(selectedOption.value);
  };

  const submitForm = (e) => {
    e.preventDefault();
    if (!selectedAvatar) {
      alert("Please select an avatar.");
      return;
    }

    if (!room) {
      alert("Please select a chat room.");
      return;
    }

    // onFormSubmit(username, selectedAvatar);
    onFormSubmit(username, selectedAvatar, room);
  };

  return (
    <div className="flex-div-reg">
      <form onSubmit={submitForm} name="reg-form" className="registration-form">
        <div className="flexbox-baseline">
          <label className="registration-label-a">Username:</label>
          <input
            className="input-username"
            type="text"
            placeholder="Enter username..."
            maxLength={15}
            required
            onChange={getUsername}
          />
        </div>

        <div>
          <div className="flexbox-baseline">
            <label className="registration-label-b">Select your avatar:</label>
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
          <label className="registration-label-b chatroom-label">
            Join a room:
          </label>
          

          <Select
            options={roomOptions}
            value={roomOptions.find((option) => option.value === room)}
            onChange={getRoom}
            placeholder="Select your topic"
            className="custom-select"
            classNamePrefix="custom-select-prefix"
          />
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
