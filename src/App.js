import "./App.css";
// import ChatTest from "./components/ChatTest";
import ChatApp from "./components/ChatApp";
import Footer from "./components/Footer";

function App() {
  return (
    <div id="root">
      <main>
        <ChatApp />
        {/* <ChatTest /> */}
      </main>
      <Footer />
    </div>
  );
}

export default App;
