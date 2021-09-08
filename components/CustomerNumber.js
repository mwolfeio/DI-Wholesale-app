import { useState, useMemo, useEffect } from "react";
import { useMutation } from "react-apollo";
import { gql } from "apollo-boost";

import Loader from "./Loader.js";

//graphql
const UPDATE_CUSTOEMR_NUMBER = gql`
  mutation customerUpdate($input: CustomerInput!) {
    customerUpdate(input: $input) {
      customer {
        metafield(namespace: "Customer", key: "Number") {
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
  //Props
  //props.data.display
  //props.data.cnumb
  //props.data.fields
  //props.data.globalId

  //State
  const [customerNumber, setCustomerNumber] = useState(
    props.data.cnumbObj.value ? `CN: ${props.data.cnumbObj.value}` : ""
  );
  const [oldCustomerNumber, setOldCustomerNumber] = useState(
    props.data.cnumbObj.value ? `CN: ${props.data.cnumbObj.value}` : ""
  );

  //Query
  const [customerUpdate, { loading, error, data }] = useMutation(
    UPDATE_CUSTOEMR_NUMBER
  );

  console.log("customer Number customerNumber: ", customerNumber);
  console.log("customer Number loading: ", loading);
  console.log("customer Number error: ", error);
  console.log("customer Number data: ", data ? data : "No Data");

  //Handle input
  const changeHandler = (e) => {
    console.log(`CN: ${e.target.value.replace("CN: ", "")}`);
    setCustomerNumber(`CN: ${e.target.value.replace("CN: ", "")}`);
  };

  const erase = (e) => {
    e.preventDefault();
    setCustomerNumber(oldCustomerNumber);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("submitting: ", customerNumber.replace("CN: ", ""));

    let payload = props.data.cnumbObj.id
      ? {
          variables: {
            input: {
              id: props.data.globalId,
              metafields: {
                id: props.data.cnumbObj.id,
                value: customerNumber.replace("CN: ", ""),
                valueType: "STRING",
              },
            },
          },
        }
      : {
          variables: {
            input: {
              id: props.data.globalId,
              metafields: {
                namespace: "Customer",
                key: "Number",
                value: customerNumber.replace("CN: ", ""),
                valueType: "STRING",
              },
            },
          },
        };

    customerUpdate(payload);
    setOldCustomerNumber(customerNumber);
  };

  //return component
  let needsSaving = customerNumber !== oldCustomerNumber;
  return (
    <form
      className={`flex-center-center customer-number-wrapper ${
        needsSaving ? "customerNumber-form-open" : ""
      }`}
      onSubmit={handleSubmit}
    >
      <input
        onChange={changeHandler}
        className="customer-number-input"
        type="text"
        placeholder="No Customer #"
        value={customerNumber}
      />
      {needsSaving ? (
        <button
          className="submit-button"
          onClick={erase}
          style={{ height: "48px", marginLeft: "8px" }}
        >
          Cancel
        </button>
      ) : (
        ""
      )}
      {needsSaving ? (
        <button style={{ height: "48px" }} type="submit">
          {loading ? <Loader size={24} /> : "Save"}
        </button>
      ) : (
        ""
      )}
    </form>
  );
};
export default Section;
