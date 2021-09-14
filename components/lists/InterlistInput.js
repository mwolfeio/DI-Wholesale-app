import { useState, useMemo, useEffect } from "react";
import { useMutation } from "react-apollo";
import { gql } from "apollo-boost";

import Loader from "../Loader.js";

//graphql
const UPDATE_CUSTOEMR_NUMBER = gql`
  mutation customerUpdate($input: CustomerInput!) {
    customerUpdate(input: $input) {
      customer {
        metafield(namespace: "Customer Number", key: "cus_no") {
          id
          namespace
          key
          value
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const Section = (props) => {
  //State
  const [customerNumber, setCustomerNumber] = useState(
    props.cnumb ? `#${props.cnumb}` : ""
  );
  const [oldCustomerNumber, setOldCustomerNumber] = useState(
    props.cnumb ? `#${props.cnumb}` : ""
  );

  //Query
  const [customerUpdate, { loading, error, data }] = useMutation(
    UPDATE_CUSTOEMR_NUMBER
  );

  console.log("List input cnumb: ", customerNumber);

  //Handle input
  const changeHandler = (e) => {
    console.log(`#${e.target.value.replace("#", "")}`);
    setCustomerNumber(`#${e.target.value.replace("#", "")}`);
  };
  const erase = (e) => {
    e.preventDefault();
    setCustomerNumber(oldCustomerNumber);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("submitting: ", customerNumber.replace("#", ""));

    let payload = props.fieldId
      ? {
          variables: {
            input: {
              id: props.cusId,
              metafields: {
                id: props.fieldId,
                value: customerNumber.replace("#", ""),
                valueType: "STRING",
              },
            },
          },
        }
      : {
          variables: {
            input: {
              id: props.cusId,
              metafields: {
                namespace: "Customer",
                key: "Number",
                value: customerNumber.replace("#", ""),
                valueType: "STRING",
              },
            },
          },
        };

    customerUpdate(payload);
    setOldCustomerNumber(customerNumber);
  };
  const preventClickthrough = (e) => {
    e.stopPropagation();
  };

  //return component
  let needsSaving = customerNumber !== oldCustomerNumber;
  return (
    <div
      class="list-input-wrapper "
      style={{ position: "relative", height: "36px", width: "100%" }}
      onClick={preventClickthrough}
    >
      <form
        className={`customer-number-wrapper ${
          needsSaving
            ? "customerNumber-form-open customerNumber-form-list-input"
            : ""
        }`}
        onSubmit={handleSubmit}
      >
        <input
          onChange={changeHandler}
          type="text"
          placeholder="Empty"
          value={customerNumber}
          style={{ padding: 0 }}
        />
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
  );
};
export default Section;
