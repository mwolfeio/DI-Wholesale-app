import React, { useState } from "react";
import AddressBlock from "./AddressBlock.js";

const CustomerPage = ({ shipping, billing }) => {
  const [showShipping, setShowShipping] = useState(true);

  return (
    <div>
      <div className="flex-center-btw">
        <h2>Address</h2>
        <div className="order-page-shipping-toggle flex-center-btw">
          <span
            onClick={() => setShowShipping(true)}
            className="flex-center-center"
            style={{ color: showShipping ? "#4388f8" : "#B0B7C3" }}
          >
            Ship
          </span>
          <span
            onClick={() => setShowShipping(false)}
            className="flex-center-center"
            style={{ color: !showShipping ? "#4388f8" : "#B0B7C3" }}
          >
            Bill
          </span>
        </div>
      </div>
      <p className="subtitle" style={{ margin: "0 0 -6px", fontSize: "12px" }}>
        {showShipping ? "Shipping Address:" : "Billing Address:"}
      </p>
      <AddressBlock address={showShipping ? shipping : billing} />
    </div>
  );
};

export default CustomerPage;
