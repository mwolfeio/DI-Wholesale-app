import React from "react";

const Loader = (props) => {
  let height = props.size ? `${props.size}px` : "80px";
  let width = props.size ? `${props.size}px` : "80px";

  return (
    <div
      className="flex-center-center"
      style={{ margin: "20px 0", width: "100%" }}
    >
      <div className="lds-ripple" style={{ height: height, width: width }}>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};
export default Loader;
