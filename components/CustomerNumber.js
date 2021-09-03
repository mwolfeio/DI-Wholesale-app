import { useState, useMemo, useEffect } from "react";
import { useMutation } from "react-apollo";
import { gql } from "apollo-boost";
import _ from "lodash";

//components
import More from "../media/icons/More.js";

//graphql
const UPDATE_CUSTOEMR_NUMBER = gql`
  mutation updateCustomerNumber($input: customerInput!) {
    customerUpdate(input: $input) {
      customer {
        metafields(first: 1) {
          edges {
            node {
              key
              value
            }
          }
        }
      }
    }
  }
`;

const Section = (props) => {
  //State
  const [customerNumber, setCustomerNumber] = useState(
    props.cnumb ? `CN: ${props.cnumb}` : ""
  );

  const [updateCustomerNumvber, { loading, error, data }] = useMutation(
    UPDATE_CUSTOEMR_NUMBER
  );

  console.log("customerNumber: ", customerNumber);

  //Handle input
  const changeHandler = (event) => {
    console.log("inputed value: ", event.target.value);
    setCustomerNumber(`CN: ${event.target.value.replace("CN: ", "")}`);
  };
  const debouncedChangeHandler = useMemo(
    () => _.debounce(changeHandler, 300),
    []
  );
  useEffect(() => {
    return () => {
      debouncedChangeHandler.cancel();
    };
  }, []);

  //return component
  return (
    <div className="flex-center-center">
      <input
        onChange={debouncedChangeHandler}
        className="customer-number-input"
        type="text"
        placeholder="No Customer #"
        value={customerNumber}
      />
    </div>
  );
};
export default Section;
