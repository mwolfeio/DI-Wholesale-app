import { useState, useMemo, useEffect } from "react";
import { useMutation } from "react-apollo";
import { gql } from "apollo-boost";

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

  console.log("customerNumber: ", customerNumber);
  console.log("loading: ", loading);
  console.log("error: ", error);
  console.log("data: ", data ? data : "No Data");

  //Handle input
  const changeHandler = (e) => {
    console.log(`CN: ${e.target.value.replace("CN: ", "")}`);
    setMetafield(`CN: ${e.target.value.replace("CN: ", "")}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("submitting: ", metafield);
    setOldMetafield(metafield);

    let payload = data.customerUpdate.customer.metafield.id
      ? {
          variables: {
            input: {
              id: props.data.globalId,
              metafields: {
                id: data.customerUpdate.customer.metafield.id,
                value: e.target.value.replace("CN: ", ""),
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
                value: e.target.value.replace("CN: ", ""),
                valueType: "STRING",
              },
            },
          },
        };

    customerUpdate(payload);
  };

  //return component
  return (
    <form className="flex-center-center" onSubmit={handleSubmit}>
      <input
        onChange={changeHandler}
        className="customer-number-input"
        type="text"
        placeholder="No Customer #"
        value={customerNumber}
      />
      {customerNumber !== oldCustomerNumber ? (
        <button style={{ height: "48px", marginLeft: "8px" }} type="submit">
          Save
        </button>
      ) : (
        ""
      )}
    </form>
  );
};
export default Section;
