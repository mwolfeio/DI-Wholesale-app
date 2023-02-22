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
  console.log("customerNumber: ", customerNumber);
  console.log("oldCustomerNumber: ", oldCustomerNumber);
  console.log("varfied: ", varfied);
  console.log("props: ", props);

  //Query
  const [customerUpdate, { loading, error, data }] = useMutation(
    UPDATE_CUSTOEMR_NUMBER
  );

  console.log("loading: ", loading);
  console.log("data: ", data);
  console.log("error: ", error);

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

    console.log("submitting");
    console.log("fieldId: ", props.fieldId);
    console.log("cusId: ", props.cusId);

    //"Type must be one of the following: color, date, date_time, json, weight,
    //volume, dimension, money, number_integer, number_decimal, rating, file_reference,
    //page_reference, product_reference, variant_reference, metaobject_reference,
    //mixed_reference, collection_reference, customer_reference, order_reference,
    //single_line_text_field, multi_line_text_field, rich_text_field, boolean, url,
    //integer, string, float, json_string, list.boolean, list.collection_reference,
    //list.color, list.date_time, list.date, list.dimension, list.file_reference,
    //list.metaobject_reference, list.mixed_reference, list.multi_line_text_field,
    //list.number_decimal, list.number_integer, list.page_reference,
    //list.product_reference, list.rating, list.single_line_text_field, list.url,
    //list.variant_reference, list.volume, list.weight."

    let payload = props.fieldId
      ? {
          variables: {
            input: {
              id: props.cusId,
              metafields: {
                id: props.fieldId,
                value: customerNumber.replace("#", ""),
                type: "string",
              },
            },
          },
        }
      : {
          variables: {
            input: {
              id: props.cusId,
              metafields: {
                namespace: "Customer Number",
                key: "cus_no",
                value: customerNumber.replace("#", ""),
                type: "string",
              },
            },
          },
        };

    console.log("payload: ", payload);
    customerUpdate(payload);
    setVarified(true);
    setOldCustomerNumber(customerNumber);
  };
  const preventClickthrough = (e) => {
    e.stopPropagation();
  };
  const submitVarification = (e) => {
    e.preventDefault();

    let payload = props.varifyId
      ? {
          variables: {
            input: {
              id: props.cusId,
              metafields: {
                id: props.varifyId,
                value: "true",
                type: "BOOLEAN",
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
                type: "BOOLEAN",
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
