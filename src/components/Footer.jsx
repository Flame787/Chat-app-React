import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faLinkedinIn } from "@fortawesome/free-brands-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faLink } from "@fortawesome/free-solid-svg-icons";

export default function Footer() {
  return (
    <div className="footer">
      <div className="scaledrone-link copyright">
        Powered by:
        <div className="scaledrone-icon">
          <a
            href="https://www.scaledrone.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Scaledrone"
            title=" Scaledrone"
          >
            <img src="/scaledrone-icon3.png" alt="scaledrone" />
          </a>
        </div>
        <a
          href="https://www.scaledrone.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Scaledrone"
          title=" Scaledrone"
        >
          <span className="scaledrone-title">Scaledrone</span>
        </a>
      </div>

      <div className="author copyright">
        &copy; {new Date().getFullYear()} Marina Brezovic
        <div className="social-links">
           <a
            href="https://marina-dev.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Website"
            title="Website"
          >
            <FontAwesomeIcon icon={faLink} />
          </a>
          <a
            href="https://github.com/Flame787"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            title="Github"
          >
            <FontAwesomeIcon icon={faGithub} />
          </a>
          <a
            href="https://www.linkedin.com/in/marina-brezovic-210b583b"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            title="Linkedin"
          >
            <FontAwesomeIcon icon={faLinkedinIn} />
          </a>

          <a
            href="mailto:mbrezovic77@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Email"
            title="Email"
          >
            <FontAwesomeIcon icon={faEnvelope} />
          </a>
        </div>
      </div>

      
    </div>
  );
}
