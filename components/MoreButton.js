import { useState } from "react";

import More from "../media/icons/More.js";

export default function SpecialPage(props) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        className="icon"
        style={{ marginLeft: "8px" }}
      >
        <More />
      </button>
      {open && <div className="dropdown-wrapper">{props.children}</div>}
    </div>
  );
}
