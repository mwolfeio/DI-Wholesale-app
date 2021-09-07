import React from "react";
import Add from "../media/icons/Minimize.js";

export default function SpecialPage(props) {
  return (
    <div className="flex-center-btw" onClick={props.minimize}>
      <button
        className="icon"
        style={{
          marginLeft: "8px",
          transform: `rotate(${props.status ? 0 : 180}deg)`,
        }}
      >
        <Add />
      </button>
    </div>
  );
}
