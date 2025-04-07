export default function Logout({ onLogout }) {
  return (
    <div className="logout-div">
      <button className="logout-button" onClick={onLogout}>
        Logout
      </button>
    </div>
  );
}
