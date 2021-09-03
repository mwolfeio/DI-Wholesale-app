import React from "react";
import More from "../media/icons/More.js";

export default function SpecialPage(props) {
  const handleChange = (e) => {
    console.log(e.target.value);
  };
  const autoGrow = (e) => {
    let value = e.target.value;
    return "auto";
  };

  return (
    <div className="flex-center-center">
      <h1 style={{ margin: 0 }}>CN:</h1>
      <input
        onChange={handleChange}
        className="customer-number-input"
        type="text"
        placeholder="No number"
        value={props.cnumb}
        style={{ width: autoGrow }}
      />
    </div>
  );
}
// <span class=input role="textbox" contenteditable>
//   {props.cnumb}
// </span>
