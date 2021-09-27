import { useState, useEffect } from "react";
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
  const [varfied, setVarified] = useState(
    props.varfiedValue == "true" ? true : false
  );
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

  console.log("props.varfiedValue: ", props.varfiedValue);
  console.log(
    "props.varfiedValue == `true` ",
    props.varfiedValue == "true" ? true : false
  );
  console.log("varfied: ", varfied);

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
    setVarified(true);
    setOldCustomerNumber(customerNumber);
  };
  const preventClickthrough = (e) => {
    e.stopPropagation();
  };
  const submitVarification = (e) => {
    e.preventDefault();
    console.log("varifying");
    let payload = props.varifyId
      ? {
          variables: {
            input: {
              id: props.cusId,
              metafields: {
                id: props.varifyId,
                value: "true",
                valueType: "BOOLEAN",
              },
            },
          },
        }
      : {
          variables: {
            input: {
              id: props.cusId,
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

  useEffect(() => {
    setCustomerNumber(props.cnumb ? `#${props.cnumb}` : "");
    setOldCustomerNumber(props.cnumb ? `#${props.cnumb}` : "");
  }, [props.cnumb]);

  useEffect(() => {
    console.log("resetting value------------------");
    setVarified(props.varfiedValue == "true" ? true : false);
  }, [props.varfiedValue]);

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
      {varfied || needsSaving || !customerNumber ? (
        ""
      ) : (
        <div
          onClick={submitVarification}
          className="tinny-tag active-tiny-tab flex-center-center varfied-list-tag"
        >
          Verify
        </div>
      )}
    </div>
  );
};
export default Section;
