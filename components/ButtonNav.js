import Link from "next/link";
import Back from "../media/icons/Back.js";
import Dash from "../media/icons/Dashboard.js";
import More from "../media/icons/More.js";

export default function SpecialPage(props) {
  return (
    <div className="flex-center-btw" style={{ marginBottom: "16px" }}>
      <div className="flex-center-left">
        <Link href={`/${props.back}`}>
          <button style={{ marginRight: "8px" }}>
            <Back />
            Back
          </button>
        </Link>
        <Link href="/">
          <button>
            <Dash />
            Dashboard
          </button>
        </Link>
      </div>
      <button className="icon">
        <More />
      </button>
    </div>
  );
}
