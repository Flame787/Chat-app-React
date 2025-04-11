export default function Logout({ onLogout, room }) {
  return (
    <div className="room-logout-div">
      <div className="room-title">
        <button className="logout-button room-button">
          Chat room: <span>{room}</span>{" "}
        </button>
      </div>
      <div className="logout-div">
        <button className="logout-button" onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}
