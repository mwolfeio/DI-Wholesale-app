import Link from "next/link";
import { useState, useEffect } from "react";
import { useMutation } from "react-apollo";
import { gql } from "apollo-boost";

import SectionHeader from "./SectionHeader.js";

//graphql
const UPDATE_CUSTOEMR_TAGS = gql`
  mutation customerUpdate($input: CustomerInput!) {
    customerUpdate(input: $input) {
      customer {
        tags
      }
      userErrors {
        field
        message
      }
    }
  }
`;

var formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const formatDiscount = (rawDiscount) => {
  return (Math.round(rawDiscount * 100) / 100).toFixed(2);
};

const Section = ({ name, discountObj }) => {
  const [open, setOpen] = useState(true);
  const [oldDiscount, setOldDiscount] = useState(
    discountObj ? formatDiscount(discountObj.value) : ""
  );
  const [discount, setDiscount] = useState(
    discountObj ? formatDiscount(discountObj.value) : ""
  );

  //Query
  const [customerUpdate, { loading, error, data }] =
    useMutation(UPDATE_CUSTOEMR_TAGS);

  //functions
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("submitting: ", discount);

    let payload = {
      variables: {
        input: {
          id: props.cusId,
          tags: ["string together tags"],
        },
      },
    };

    customerUpdate(payload);
    setOldDiscount(discount);
  };
  const toggleOpen = () => {
    console.log("clicked");
    setOpen(!open);
  };
  const handleInput = (e) => {
    console.log("running handleInput");
    let value = e.target.value;
    let finalValue;

    if (value > 100) finalValue = 100;
    else if (value < 0) finalValue = 0;
    else finalValue = value;

    setDiscount((Math.round(finalValue * 100) / 100).toFixed(2));
  };
  const erase = (e) => {
    e.preventDefault();
    setDiscount(oldDiscount);
  };
  let needsSaving = discount !== oldDiscount;
  return (
    <section>
      <SectionHeader
        status={open}
        minimize={toggleOpen}
        title="Customer Discount"
      />

      {open ? (
        <div className="card-container">
          <form
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
            {needsSaving ? (
              <div className="flex-center-center">
                <button onClick={erase}>X</button>
                <button
                  className="submit-button"
                  style={{
                    marginLeft: "4px",
                  }}
                  type="submit"
                >
                  {loading ? <Loader size={24} /> : "✔"}
                </button>
              </div>
            ) : (
              ""
            )}
          </form>
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
