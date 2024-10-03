import "./style.css";

function Footer() {
  return (
    <footer>
      <div className="flexbox footer-div">
        <div className="flex-item footer-item">
          &copy; {new Date().getFullYear()} - CryptoChat{" "}
        </div>
        <div className="flex-item footer-item">
          <a href="/about">What is CryptoChat?</a>
        </div>
        <div className="flex-item footer-item">
          <a href="/contact">Contact Me</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
