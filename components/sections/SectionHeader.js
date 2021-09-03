import React from "react";
import MoreButton from "../MoreButton.js";
import AddButton from "../AddButton.js";

const Section = (props) => {
  return (
    <div className="flex-center-btw" style={{ marginBottom: "8px" }}>
      <h2>{props.title}</h2>
      <div className="flex-center-right">
        <AddButton />
        <MoreButton />
      </div>
    </div>
  );
};
export default Section;
