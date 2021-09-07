import React from "react";
import Minimize from "../media/icons/Minimize.js";

const Section = (props) => {
  return (
    <div className="flex-center-btw" onClick={props.minimize}>
      <button className="icon">
        <span
          style={{
            marginLeft: "8px",
            transform: `rotate(${props.status ? 180 : 0}deg)`,
          }}
        >
          <Minimize />
        </span>
      </button>
    </div>
  );
};
export default Section;
