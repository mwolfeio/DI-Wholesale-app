import { useState, useMemo, useEffect } from "react";
import { useMutation } from "react-apollo";
import { gql } from "apollo-boost";
import _ from "lodash";

//components
import More from "../media/icons/More.js";

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
  //State
  const [customerNumber, setCustomerNumber] = useState(
    props.data.cnumbObj.value ? `CN: ${props.data.cnumbObj.value}` : ""
  );
  console.log("Customer props: ", props);
  console.log("Customer display: ", props.data.display);
  console.log("Customer cnumb: ", props.data.cnumb);
  console.log("Customer fields: ", props.data.fields);
  console.log("Customer globalId: ", props.data.globalId);

  const [customerUpdate, { loading, error, data }] = useMutation(
    UPDATE_CUSTOEMR_NUMBER
  );

  console.log("customerNumber: ", customerNumber);
  console.log("loading: ", loading);
  console.log("error: ", error);
  console.log("data: ", data ? data : "No Data");

  //Handle input
  const changeHandler = (e) => {
    console.log("inputed value: ", e.target.value);
    setCustomerNumber(`CN: ${e.target.value.replace("CN: ", "")}`);
    // customerUpdate();

    customerUpdate({
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
