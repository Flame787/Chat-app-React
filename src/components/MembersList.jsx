import Member from "./Member";

export default function MembersList({ members, me }) {
  return (
    <div>
      <div>
        Currently {members.length} user {members.length === 1 ? "" : "s"}{" "}
        online.
      </div>
      {/* displaying how many members are online */}
      <div>
        {members.map((member) => (
          <Member
            key={member.id}
            id={member.id}
            memberData={member.memberData}
            isMe={member.id === me.id}
          />
        ))}
      </div>
    </div>
  );
}
