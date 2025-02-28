export default function TypingIndicator({ members }) {
  const users = members.map((member) => member.memberData.username);

  // if no users typing, only empty div is returned:
  if (users.length === 0) {
    return <div>{/* style - typing indicator */}</div>;
  }
  // if one user is typing, we are notified which user that is:
  if (users.length === 1) {
    return <div>{users[0]} is typing...</div>;
  }
  // if more users are typing, we are concatinating their usernames. slice(0,-1) takes all but last name
  // join(", ") puts a comma between the usernames, and slice(-1) takes the last username
  const typingUsers = users.slice(0, -1).join(", ") + " and " + users.slice(-1);
  return <div>{typingUsers} are typing.</div>;
}
