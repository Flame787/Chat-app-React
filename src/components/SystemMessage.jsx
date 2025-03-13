export default function SystemMessage(infos) {
  function showInfo(info) {
    const { data, id, type } = info;

    const messageClass = (type === "user-joined") ? "user-joined" : "";

  }

  return <div className={messageClass}>{infos.map((info) => showMessage(info))}</div>;
}
