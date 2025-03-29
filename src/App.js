import "./App.css";
import ChatApp from "./components/ChatApp";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <div id="root">
      <main>
        <ChatApp />
        <ScrollToTop />
      </main>
      <Footer />
    </div>
  );
}

export default App;
