export default function TypingIndicator({ members }) {


  // const users = members.map((member) => member.memberData.username);

  const users = members
    .map((member) => member?.memberData?.username)
    .filter(Boolean); // Filtrira prazne vrijednosti

  // if no users typing, only empty div is returned:
  if (users.length === 0) {
    return <div>{/* style - typing indicator */}</div>;
  }
  // if one user is typing, we are notified which user that is (by it's index):
  if (users.length === 1) {
    return <div>{users[0]} is typing...</div>;
  }
  // if more users are typing, we are concatinating their usernames. slice(0,-1) takes all but last name
  // join(", ") puts a comma between the usernames, and slice(-1) takes the last username
  const typingUsers = users.slice(0, -1).join(", ") + " and " + users.slice(-1);

  // this component returns a small div, with info about which user(s) is/are currently typing:
  return <div>{typingUsers} are typing.</div>;
}


// npm i typing-indicator
