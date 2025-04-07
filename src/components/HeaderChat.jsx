import React, { useState, useEffect } from "react";
import Logout from "./Logout";

export default function HeaderChat({ onLogout }) {
  const [isScrolled, setIsScrolled] = useState(false); // Praćenje pozicije skrolanja

  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 0) {
        setIsScrolled(true); // header hides
      } else {
        setIsScrolled(false); // header is fully visible
      }
    };

    window.addEventListener("scroll", handleScroll);

    // cleaning:
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className={`header-div ${isScrolled ? "header-hidden" : ""}`}>
      <div className="header2 welcome-registration">
        <h1>Chat App</h1>
        <h3>Make new connections, stay in touch</h3>
        <Logout onLogout={onLogout} />
      </div>
    </div>
  );
}
