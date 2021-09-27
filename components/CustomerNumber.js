import { useState, useMemo, useEffect } from "react";
import { useMutation } from "react-apollo";
import { gql } from "apollo-boost";

import Loader from "./Loader.js";

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
  console.log("customer number: ", props);

  //State
  const [customerNumber, setCustomerNumber] = useState(
    props.data.cnumbObj.value ? `CN: ${props.data.cnumbObj.value}` : ""
  );
  const [oldCustomerNumber, setOldCustomerNumber] = useState(
    props.data.cnumbObj.value ? `CN: ${props.data.cnumbObj.value}` : ""
  );
  const [varfied, setVarified] = useState(
    props.data.varifiedObj && props.data.varifiedObj.value === "true"
      ? true
      : false
  );

  //Query
  const [customerUpdate, { loading, error, data }] = useMutation(
    UPDATE_CUSTOEMR_NUMBER
  );

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
                namespace: "Customer Number",
                key: "cus_no",
                value: customerNumber.replace("CN: ", ""),
                valueType: "STRING",
              },
            },
          },
        };

    customerUpdate(payload);
    submitVarification();
    setOldCustomerNumber(customerNumber);
  };
  const submitVarification = (e) => {
    console.log("varifying");
    e.preventDefault();
    let payload = props.data.varifiedObj.id
      ? {
          variables: {
            input: {
              id: props.data.globalId,
              metafields: {
                id: props.data.varifiedObj.id,
                value: "true",
                valueType: "BOOLEAN",
              },
            },
          },
        }
      : {
          variables: {
            input: {
              id: props.data.globalId,
              metafields: {
                namespace: "CN Varified",
                key: "cus_var",
                value: "true",
                valueType: "BOOLEAN",
              },
            },
          },
        };

    customerUpdate(payload);
    setVarified(true);
  };

  //return component
  let needsSaving = customerNumber !== oldCustomerNumber;
  return (
    <div className="flex-center-center">
      <div style={{ position: "relative", height: "43px", width: "248px" }}>
        <form
          className={`customer-number-wrapper  ${
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
            <div className="flex-center-center">
              <button onClick={erase} style={{ height: "36px", width: "100%" }}>
                Cancel
              </button>
              <button
                className="submit-button"
                style={{ height: "36px", marginLeft: "8px", width: "100%" }}
                type="submit"
              >
                {loading ? (
                  <Loader size={24} />
                ) : (
                  `Save ${!varfied ? "& Verify" : ""}`
                )}
              </button>
            </div>
          ) : (
            <div
              className={`varified-msg ${
                varfied ? "drop-ship-tiny-tab" : "error-tab"
              } tinny-tag  flex-center-center`}
            >
              {varfied ? "Verified" : "Unverified"}
            </div>
          )}
        </form>
      </div>
      {!varfied && oldCustomerNumber && (
        <button
          onClick={submitVarification}
          style={{ marginLeft: "8px" }}
          className="primary"
        >
          Verify CN
        </button>
      )}
    </div>
  );
};
export default Section;
