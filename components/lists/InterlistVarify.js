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

  if (error) console.log("error: ", error);

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
    console.log(
      "There is already a customer number: ",
      props.fieldId ? true : false
    );

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
                namespace: "Customer Number",
                key: "cus_no",
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
    {props.customer.varified ? (
      ""
    ) : (
      <div className="tinny-tag active-tiny-tab flex-center-center varfied-list-tag">
        varified
      </div>
    )}
  );
};
export default Section;
