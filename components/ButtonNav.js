import React from "react";
import Link from "next/link";
import Back from "../media/icons/Back.js";
import Dash from "../media/icons/Dashboard.js";
import More from "../media/icons/More.js";

export default function SpecialPage(props) {
  let link = props.back ? `/${props.back}` : "/";
  return (
    <div className="flex-center-btw" style={{ marginBottom: "16px" }}>
      <div className="flex-center-left">
        <Link href={link}>
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
      <div className="flex-center-right">
        {props.cnumb ? <h1>CN: {props.cnumb}</h1> : ""}
        <button className="icon" style={{ marginLeft: "16px" }}>
          <More />
        </button>
      </div>
    </div>
  );
}
