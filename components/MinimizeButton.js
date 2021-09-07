import React from "react";
import Add from "../media/icons/Minimize.js";

export default function SpecialPage(props) {
  return (
    <div
      className="flex-center-btw"
      onClick={() => props.minimize(!props.status)}
    >
      <button
        className="icon"
        style={{
          marginLeft: "8px",
          transform: `rotate(${props.status ? 180 : 0}deg)`,
        }}
      >
        <Add />
      </button>
    </div>
  );
}
