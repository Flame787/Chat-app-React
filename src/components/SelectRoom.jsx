export default function SelectRoom() {
  return (
    <>
      <label className="registration-label-b chatroom-label">
        Join a room:
      </label>
      <select
        className="room-select"
        name="room"
        required
        value={room}
        onChange={getRoom}
      >
        <option value="" disabled>
          Select your topic:
        </option>
        <option value="Tech">Tech</option>
        <option value="Travel">Travel</option>
        <option value="Music">Music</option>
        <option value="Sports">Sports</option>
        <option value="Business">Business</option>
        <option value="Education">Education</option>
        <option value="Chill-zone">Chill zone</option>
      </select>
    </>
  );
}
