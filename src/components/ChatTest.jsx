// Rešenje:
// Koristi setMemberLeft sa prevState kako bi osigurao da se isti član ne obrađuje više puta.

// ✅ Ispravljena verzija:
// javascript
// Copy
// Edit
// room.on("member_leave", (member) => {
//   setMemberLeft((prevMemberLeft) => {
//     if (prevMemberLeft?.id !== member.id) {
//       console.log(`${member.clientData.username} has left the chat`);
//       drone.publish({
//         room: "observable-room",
//         message: {
//           text: `${member.clientData.username} has left the chat.`,
//           type: "user-left",
//         },
//       });
//       return member; // Ažurira stanje samo ako je novi odlazak
//     }
//     return prevMemberLeft; // Ako je isti član već obrađen, ne menja stanje
//   });
// });
// 🔹 Šta smo popravili?

// Koristimo prevMemberLeft da bismo sprečili dupliranje obaveštenja.
// Proveravamo member.id, ne ceo member objekat jer je objekat referenca i može se promeniti čak i ako predstavlja istog člana.
// Probaj ovu verziju i javi da li sada radi ispravno. 🚀ž



let lastMessage = chat.messages[chat.messages.length - 1];
console.log("lastMessage: ", lastMessage);