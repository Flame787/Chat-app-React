import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faLinkedinIn } from "@fortawesome/free-brands-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
  return (
    <div className="footer">
      <div className="copyright">
        &copy; {new Date().getFullYear()} Marina Brezovic
      </div>
      <div className="social-links">
        <a
          href="https://github.com/Flame787"
          target="_blank"
          aria-label="GitHub"
          title="Github"
        >
          <FontAwesomeIcon icon={faGithub} />
        </a>
        <a
          href="https://www.linkedin.com/in/marina-brezovic-210b583b"
          target="_blank"
          aria-label="LinkedIn"
          title="Linkedin"
        >
          <FontAwesomeIcon icon={faLinkedinIn} />
        </a>
        <a
          href="mailto:mbrezovic77@gmail.com"
          target="_blank"
          aria-label="Email"
          title="Email"
        >
          <FontAwesomeIcon icon={faEnvelope} />
        </a>
      </div>
    </div>
  );
}
