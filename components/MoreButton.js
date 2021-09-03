import React from "react";
import More from "../media/icons/More.js";

export default function SpecialPage(props) {
  return (
    <div className="flex-center-btw">
      <button className="icon" style={{ marginLeft: "16px" }}>
        <More />
      </button>
    </div>
  );
}
