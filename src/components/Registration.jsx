import { useState } from "react";

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

  const getUsername = (e) => {
    setUsername(e.target.value);
  };


  const selectAvatar = (avatar) => {
    setSelectedAvatar(avatar);
  };

  // NEW:
  const getRoom = (e) => {
    setRoom(e.target.value);
  };


  const submitForm = (e) => {
    e.preventDefault();
    if (!selectedAvatar) {
      alert("Please select an avatar!");
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
            placeholder="Enter name..."
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

        <select
          className="reg-form__room-select"
          name="room"
          required
          value={room}
          onChange={getRoom}
        >
           <option value="" disabled>
            Choose a chatroom
          </option>
          <option value="Education">Education</option>
          <option value="Business">Business</option>
          <option value="Tech">Tech</option>
          <option value="Travel">Travel</option>
          <option value="Music">Music</option>
          <option value="Sports">Sports</option>
          <option value="Chill-zone">Chill zone</option>
        </select>

        <div className="flexbox-baseline">
          <button className="registration-button" type="submit">
            Start chat
          </button>
        </div>
      </form>
    </div>
  );
}
