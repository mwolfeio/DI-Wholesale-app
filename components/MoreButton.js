import { useState } from "react";

import More from "../media/icons/More.js";
import Close from "../media/icons/Close.js";

export default function SpecialPage(props) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        className="icon"
        style={{ marginLeft: "8px" }}
      >
        {!open ? <More /> : <Close />}
      </button>
      {open && <div className="dropdown-wrapper">{props.children}</div>}
    </div>
  );
}
