import React from "react";
import Minimize from "../media/icons/Minimize.js";

const Section = (props) => {
  return (
    <div
      className="flex-center-btw"
      onClick={props.func}
      style={{
        marginLeft: "8px",
      }}
    >
      <button className="icon">
        <div
          style={{
            display: "block",
            transform: `rotate(${props.status ? 180 : 0}deg)`,
          }}
        >
          <Minimize />
        </div>
      </button>
    </div>
  );
};
export default Section;
