import Link from "next/link";
import { useState, useEffect } from "react";
import { useQuery } from "react-apollo";
import { gql } from "apollo-boost";

import SectionHeader from "./SectionHeader.js";

var formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const Section = ({ name, discountObj }) => {
  const [open, setOpen] = useState(true);
  const [discount, setDiscount] = useState(
    discountObj ? (Math.round(discountObj.value * 100) / 100).toFixed(2) : ""
  );

  const toggleOpen = () => {
    console.log("clicked");
    setOpen(!open);
  };
  const handleInput = (e) => {
    console.log("running handleInput");
    let value = e.target.value;
    let finalValue;
    if (value > 100) finalValue = 100;
    if (value < 0) finalValue = 0;

    setDiscount((Math.round(finalValue * 100) / 100).toFixed(2));
  };

  return (
    <section>
      <SectionHeader
        status={open}
        minimize={toggleOpen}
        title="Customer Discount"
      />

      {open ? (
        <div className="card-container">
          <div
            className="flex-center-center discount-text"
            style={{ color: "#b0b7c3" }}
          >
            <p>{name} will recieve a</p>
            <input
              type="number"
              step="0.01"
              max="100"
              min="0"
              value={discount}
              onChange={handleInput}
              placeholder="00.00"
            />
            <p>% discount on all orders.</p>
          </div>
        </div>
      ) : (
        ""
      )}
    </section>
  );
};
export default Section;

// <select name="order-type" id="order-type">
//   <option value="all">All orders</option>
//   <option value="wholesale">Wholesale orders</option>
//   <option value="drop">Drop Shipping orders</option>
// </select>
// <p>.</p>
