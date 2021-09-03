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
        metafield(key: "data", namespace: "customer_fields") {
          value
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

  console.log("Customer Metafields: ", props.fields);

  const [updateCustomerNumvber, { loading, error, data }] = useMutation(
    UPDATE_CUSTOEMR_NUMBER
  );

  console.log("customerNumber: ", customerNumber);

  //Handle input
  const changeHandler = (e) => {
    console.log("inputed value: ", e.target.value);
    setCustomerNumber(`CN: ${e.target.value.replace("CN: ", "")}`);

    updateCustomerNumvber({
      variables: {
        input: {
          id: "gid://shopify/Product/1",
          metafields: [
            {
              id: "gid://shopify/Metafield/4143381872696",
              value: "hang dry",
            },
          ],
        },
      },
    });
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
        onChange={changeHandler}
        className="customer-number-input"
        type="text"
        placeholder="No Customer #"
        value={customerNumber}
      />
    </div>
  );
};
export default Section;
