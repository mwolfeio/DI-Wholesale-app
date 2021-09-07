import { useState, useMemo, useEffect } from "react";
import { useMutation } from "react-apollo";
import { gql } from "apollo-boost";
import _ from "lodash";

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

  //Query
  const [customerUpdate, { loading, error, data }] = useMutation(
    UPDATE_CUSTOEMR_NUMBER
  );

  console.log("customerNumber: ", customerNumber);
  console.log("loading: ", loading);
  console.log("error: ", error);
  console.log("data: ", data ? data : "No Data");

  //Handle input
  const submitQuery = (e) => {
    // console.log("updating customer number to value: ", e.target.value);

    customerUpdate({
      variables: {
        input: {
          id: props.data.globalId,
          metafields: {
            id: props.data.cnumbObj.id,
            value: e.target.value.replace("CN: ", ""),
            valueType: "STRING",
          },
        },
      },
    });
  };

  const updateState = (e) => {
    setCustomerNumber(`CN: ${e.target.value.replace("CN: ", "")}`);
  };

  // const debouncedChangeHandler = useMemo(
  //   () => _.debounce(submitQuery, 300),
  //   []
  // );

  const debouncedChangeHandler = _.debounce(submitQuery, 300);

  useEffect(() => {
    return () => {
      debouncedChangeHandler.cancel();
    };
  }, []);

  //return component
  return (
    <div className="flex-center-center">
      <input
        onChange={(e) => {
          updateState(e);
          debouncedChangeHandler(e);
        }}
        className="customer-number-input"
        type="text"
        placeholder="No Customer #"
        value={customerNumber}
      />
    </div>
  );
};
export default Section;
