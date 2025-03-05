
import './App.css';
import ChatApp from './components/ChatApp';

function App() {
  return (
    
    // <h1>hello</h1>
    
    <ChatApp />
  );
}

export default App;


/* To start the React app on localhost:3000 -> npm start

Scaledrone freen plan supports max. 100 users at the same time, up to 20 connections opened at the same time, 
and up to 100k events* (messages and observable events) per day.

* If a user sends a message to 10 other users, it will be counted as 11 events. 

All traffic is end-to-end SSL encrypted.

*/
