export default function Message({ member, data, id }, me) {
  const { username, color } = member.memberData;
  // destructuring member-data

  const messageFromMe = member.id === me.id;
  // checks if the id (of a message sender) is the same as id from current user
  // if this is true, then additional css-class will apply to distinguish 'my' message from messages of other members

  // const className = messageFromMe ? ${style-message} ${style-currentMember} : style-message;

  return (
    <li key={id} className={className}>
      <span />   
      {/* avatar + color */}
      <div>{username}</div>
      <div>{data}</div>
      {/* data = text of the message */}
    </li>
  );
}
