import { useState } from "react";
import { useMutation } from "react-apollo";
import { gql } from "apollo-boost";

//graphql
const UPDATE_METAFIELD = gql`
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
  const [oldMetafield, setOldMetafield] = useState(props.value);

  //Query
  const [customerUpdate, { loading, error, data }] =
    useMutation(UPDATE_METAFIELD);

  //Handle input
  const changeHandler = (e) => {
    setMetafield(e.target.value);
  };

  //Sumbit
  const submitHandler = (e) => {
    e.preventDefault();
    console.log("saving: ", e.target.value);
    setOldMetafield(e.target.value);
    // customerUpdate();

    customerUpdate({
      variables: {
        input: {
          id: props.custoemrId,
          metafields: {
            id: props.MetafieldId,
            value: e.target.value.replace("CN: ", ""),
            valueType: "STRING",
          },
        },
      },
    });
  };

  //return component
  return (
    <form onSubmit={submitHandler} style={{ display: "flex" }}>
      <input
        onChange={changeHandler}
        style={{ borderRadius: "10px" }}
        className=""
        type="text"
        placeholder="No Customer #"
        value={metafield}
      />
      {metafield !== oldMetafield ? (
        <button
          style={{ height: "48px", marginLeft: "8px" }}
          onClick={submitHandler}
        >
          Save
        </button>
      ) : (
        ""
      )}
    </form>
  );
};
export default Section;
