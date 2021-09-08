import { useState } from "react";
import { useMutation } from "react-apollo";
import { gql } from "apollo-boost";

//graphql
const UPDATE_METAFIELD = gql`
  mutation customerUpdate(
    $input: CustomerInput!
    $namespace: String! = "Customer"
    $key: String! = "Number"
  ) {
    customerUpdate(input: $input) {
      customer {
        metafield(namespace: $namespace, key: $key) {
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
// const UPDATE_METAFIELD = gql`
//   mutation customerUpdate($input: CustomerInput!) {
//     customerUpdate(input: $input) {
//       customer {
//         metafield(namespace: "Customer", key: "Number") {
//           id
//           namespace
//           key
//           value
//         }
//       }
//       userErrors {
//         field
//         message
//       }
//     }
//   }
// `;

const Section = (props) => {
  //State
  const [metafield, setMetafield] = useState(props.value);
  const [oldMetafield, setOldMetafield] = useState(props.value);

  console.log("Metafield metafieldKey: ", props.metafieldKey);
  console.log("Metafield namespace: ", props.namespace);
  console.log("Metafield custoemrId: ", props.custoemrId);
  console.log("Metafield MetafieldId: ", props.MetafieldId);

  //Query
  const [customerUpdate, { loading, error, data }] =
    useMutation(UPDATE_METAFIELD);

  //Handle input
  const changeHandler = (e) => {
    console.log(e.target.value);
    setMetafield(e.target.value);
  };

  //Sumbit
  const submitHandler = (e) => {
    e.preventDefault();
    console.log("submitting: ", metafield);
    setOldMetafield(metafield);

    customerUpdate({
      variables: {
        namespace: props.namespace,
        key: props.metafieldKey,
        input: {
          id: props.custoemrId,
          metafields: {
            id: props.MetafieldId,
            value: metafield,
            valueType: "STRING",
          },
        },
      },
    });
  };

  console.log("Metafield Data: ", data);
  console.log("Metafield error: ", error);

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
