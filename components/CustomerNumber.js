import { useState, useMemo, useEffect } from "react";
import { useMutation } from "react-apollo";
import { gql } from "apollo-boost";
import _ from "lodash";

//components
import More from "../media/icons/More.js";

//graphql
const UPDATE_CUSTOEMR_NUMBER = gql`
  mutation {
    customerUpdate(
      input: {
        id: "gid://shopify/Customer/5510083412147"
        metafields: [
          { id: "gid://shopify/Metafield/19929682935987", value: "000" }
        ]
      }
    ) {
      customer {
        id
      }
    }
  }
`;

const Section = (props) => {
  //State
  const [customerNumber, setCustomerNumber] = useState(
    props.data.cnumb ? `CN: ${props.data.cnumb}` : ""
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
    customerUpdate();

    // customerUpdate({
    //   variables: {
    //     input: {
    //       id: "gid://shopify/customer/5510083412147",
    //       metafields: [
    //         {
    //           id: "gid://shopify/Metafield/19929682935987",
    //           value: "hang dry",
    //         },
    //       ],
    //     },
    //   },
    // });
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
