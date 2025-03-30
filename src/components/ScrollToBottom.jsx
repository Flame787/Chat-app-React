import { useState, useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { faAnglesDown } from "@fortawesome/free-solid-svg-icons";

export default function ScrollToBottom() {
  const [visible, setVisible] = useState(false);

  const handleScroll = () => {
    // if user scrolled > 300 px, the scroll-to-top-button will appear:
    setVisible(window.scrollY < document.documentElement.scrollHeight - window.innerHeight - 300);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // const scrollToBottom = () => {
  //   window.scrollTo({ top: 0, behavior: "smooth" });
  // };

  const scrollToBottom = () => {
    const scrollHeight = document.documentElement.scrollHeight;
    window.scrollTo({ top: scrollHeight, behavior: "smooth" });
  };

  return (
    // show button only if 'visible' is true:
    visible && (
      <div className="scroll-to-bottom">
        <button
          className="scroll-button"
          onClick={scrollToBottom}
          aria-label="Scroll to bottom"
          title="Scroll to bottom"
        >
          <FontAwesomeIcon icon={faAnglesDown} />
        </button>
      </div>
    )
  );
}
