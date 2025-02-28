export default function Member({ id, memberData, isMe }) {
  const { color, username } = memberData;
  // destructuring member-data



  return <div key={id}>
    <div></div>   
    {/* avatar, color */}
    <div>{username}{isMe ? " (you)" : ""}</div>
    {/* inserted username. If member is 'me', then it has a distinction: (you) */}
  </div>;
}
