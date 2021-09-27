import React from "react";
import Add from "../media/icons/Add.js";

export default function SpecialPage(props) {
  return (
    <button className="icon" style={{ marginLeft: "8px" }} onClick={props.func}>
      <Add />
    </button>
  );
}
