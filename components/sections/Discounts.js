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

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
const formatDiscount = (rawDiscount) => {
  return (Math.round(rawDiscount * 100) / 100).toFixed(2);
};
const getDiscount = (arr, subString) => {
  if (!arr) return null;
  let filteredArr = arr.filter((s) => s.includes(subString));
  return filteredArr.length > 0 ? filteredArr[0].replace(subString, "") : null;
};
const replaceDiscount = (arr, subString, discount) => {
  let discountTag = `${discount}${subString}`;
  let index = arr.findIndex((a) => a.includes(subString));

  if (index > -1) arr[index] = discountTag;
  else arr.push(discountTag);

  return arr;
};

const Section = ({ name, tags, customerId }) => {
  const [open, setOpen] = useState(true);
  const [oldDiscount, setOldDiscount] = useState(
    getDiscount(tags, "_Discount")
  );
  const [discount, setDiscount] = useState(getDiscount(tags, "_Discount"));

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
          id: customerId,
          tags: replaceDiscount(tags, "_Discount", discount),
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

    setDiscount(finalValue);
    // setDiscount((Math.round(finalValue * 100) / 100).toFixed(2));
  };
  const erase = (e) => {
    e.preventDefault();
    setDiscount(oldDiscount);
  };
  const needsSaving = discount !== oldDiscount;
  if (error) console.log("error: ", error);

  return (
    <section>
      <SectionHeader
        status={open}
        minimize={toggleOpen}
        title="Customer Discount"
      >
        {needsSaving ? (
          <div className="flex-center-center">
            <button onClick={erase}>Clear</button>
            <button
              className="submit-button"
              style={{
                marginLeft: "4px",
              }}
              type="submit"
            >
              {loading ? <Loader size={24} /> : "Submit"}
            </button>
          </div>
        ) : (
          ""
        )}
      </SectionHeader>

      {open ? (
        <div className="card-container">
          <form
            onSubmit={handleSubmit}
            className="flex-center-center discount-text"
            style={{ color: "#b0b7c3" }}
          >
            <p>{name} will recieve a</p>
            <input
              type="number"
              step="1"
              max="100"
              min="0"
              value={discount}
              onChange={handleInput}
              placeholder="00.00"
            />
            <p>% discount on all orders.</p>
          </form>
        </div>
      ) : (
        ""
      )}
    </section>
  );
};
export default Section;
