import React, { useState } from "react";

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
      <Address address={showShipping ? shipping : billing} />
    </div>
  );
};

const Address = (props) => {
  return (
    <React.Fragment>
      <div className="orders-page-address-card-address-wrapper">
        <p>
          {props.address.name}
          {props.address.address2 && props.address.company}
          {props.address.company && <br />}
          {props.address.address1}
          <br />
          {props.address.address2 && props.address.address2}
          {props.address.address2 && <br />}
          {props.address.city}, {props.address.provinceCode}
          <br />
          {props.address.zip}
          <br />
          {props.address.country}
        </p>
      </div>
      {props.address.phone && (
        <p
          className="subtitle"
          style={{ margin: "0 0 -6px", fontSize: "12px" }}
        >
          Phone:
        </p>
      )}
      <div className="orders-page-address-card-address-wrapper">
        {props.address.phone && <p>{props.address.phone}</p>}{" "}
      </div>
    </React.Fragment>
  );
};

export default CustomerPage;
