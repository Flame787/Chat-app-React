// export default function Message({ member, data, id }, me) {
export default function Message({ message, member, me }) {

//   const { id, memberData } = member;
  const { username, color } = member.memberData;   // CHECK USERNAME!!
  const { data, id } = message;
  // destructuring member and message into nested prop-attributes

//   const messageFromMe = member.id === me.id;
//   const isMe = member.id === me.id;
  // checks if the id (of a message sender) is the same as id from current user
  // if this is true, then additional css-class will apply to distinguish 'my' message from messages of other members

  // const className = messageFromMe ? ${style-message} ${style-currentMember} : style-message;

  return (
    // <li key={id} className={className}>
    <li key={id}>
      <span />
      {/* avatar + color */}
      <div>{username}</div>    
      {/* // CHECK USERNAME!! */}
      <div>{data}</div>
      {/* data = text of the message */}
    </li>
  );
}
