import React from "react";
import More from "../media/icons/More.js";

export default function SpecialPage(props) {
  return (
    <div className="flex-center-center">
      <h1 style={{ margin: 0 }}>CN: {props.cnumb}</h1>
    </div>
  );
}