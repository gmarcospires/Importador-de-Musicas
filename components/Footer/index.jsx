import {footer, logo} from '../../styles/Home.module.css'

const Footer = (props) => {
  return (
    <footer className={footer}>
      <a
        href={props.href}
        target="_blank"
        rel="noopener noreferrer"
      >
        Powered by <span className={logo}>{props.name}</span>
      </a>
    </footer>
  );
};

export default Footer;
