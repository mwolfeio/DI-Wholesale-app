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
  const [metafield, setMetafield] = useState(props.value);

  //Query
  const [customerUpdate, { loading, error, data }] = useMutation(
    UPDATE_CUSTOEMR_NUMBER
  );

  //Handle input
  const changeHandler = (e) => {
    console.log("inputed value: ", e.target.value);
    setMetafield(`CN: ${e.target.value.replace("CN: ", "")}`);
    // customerUpdate();

    // customerUpdate({
    //   variables: {
    //     input: {
    //       id: props.data.globalId,
    //       metafields: {
    //         id: props.data.cnumbObj.id,
    //         value: Metafield.replace("CN: ", ""),
    //         valueType: "STRING",
    //       },
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
    <input
      onChange={changeHandler}
      className=""
      type="text"
      placeholder="No Customer #"
      value={metafield}
    />
  );
};
export default Section;
