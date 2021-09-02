import React from "react";

const Loader = () => {
  return (
    <div
      className="flex-center-center"
      style={{ margin: "20px 0", width: "100%" }}
    >
      <div className="lds-ripple">
        <div></div>
        <div></div>
      </div>
    </div>
  );
};
export default Loader;
