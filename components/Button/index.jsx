import Link from "next/link";

const Button = (props) => {
  return (
    <Link href={props.href || ''} >
      <button
        type={props.type ? props.type : "button"}
        className={props.className}
        onClick={props.onClick}
      >
        {props.children}
      </button>
    </Link>
  );
};

export default Button;
