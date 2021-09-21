import React from "react";

const CustomerPage = (props) => {
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
