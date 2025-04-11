export default function MembersCount({ members }) {
  const membersCount = members.length;
  console.log("count of members: ", membersCount);

  //   const avatar = members[0].clientData.avatar;
  //   const username = members[0].clientData.username;

  return (
    <div className="members-count-countainer">
      
      <div className="members-count">
        Currently online: {membersCount} {membersCount === 1 ? "user" : "users"}
      </div>
      <ul className="members-online-list">
        {members.map((member) => (
          <li key={member.id} className="member-item">
            <div>
              <img
                src={`/avatars/${member.clientData.avatar}`}
                alt="user-avatar"
                title={`avatar: ${member.clientData.username}`}
                className="avatar-image"
              />
            </div>
            <div className="list-username">{member.clientData.username}</div>
          </li>
        ))}

      </ul>
    </div>
  );
}
