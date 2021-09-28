import { useState, useEffect } from "react";
import { useMutation } from "react-apollo";
import { gql } from "apollo-boost";

//graphql
const UPDATE_CUSTOMER_METAFIELD = gql`
  mutation customerUpdate(
    $input: CustomerInput!
    $namespace: String!
    $key: String!
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

const UPDATE_ORDER_METAFIELD = gql`
  mutation orderUpdate(
    $input: OrderInput!
    $namespace: String!
    $key: String!
  ) {
    orderUpdate(input: $input) {
      order {
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

const Section = (props) => {
  //State
  const [metafield, setMetafield] = useState(props.field.value);
  const [oldMetafield, setOldMetafield] = useState(props.field.value);
  const [validJson, setValidJason] = useState(false);

  //Query
  const [customerUpdate, { customerLoading, customerError, customerData }] =
    useMutation(UPDATE_CUSTOMER_METAFIELD);
  const [orderUpdate, { orderLoading, orderError, orderData }] = useMutation(
    UPDATE_ORDER_METAFIELD
  );

  //Handlers
  const changeHandler = (e) => {
    console.log(e.target.value);
    setMetafield(e.target.value);
  };
  const cancel = (e) => {
    e.preventDefault();
    setMetafield(oldMetafield);
  };
  const IsJsonString = (str) => {
    try {
      JSON.parse(str);
    } catch (e) {
      return setValidJason(false);
    }
    setValidJason(true);
  };
  const submitHandler = (e) => {
    e.preventDefault();
    console.log("submitting: ", metafield);
    if (props.field.valueType === "JSON_STRING" && !validJson) return;
    let payload = {
      variables: {
        namespace: props.field.namespace,
        key: props.field.key,
        input: {
          id: props.globalId,
          metafields: {
            id: props.field.id,
            value: metafield,
            valueType: props.field.valueType,
          },
        },
      },
    };

    if (props.type === "order") {
      orderUpdate(payload)
        .then(() => setOldMetafield(metafield))
        .catch((err) => console.log(err));
    } else if (props.type === "customer") {
      customerUpdate(payload)
        .then(() => setOldMetafield(metafield))
        .catch((err) => console.log(err));
    } else console.log("no type specified or unrecognized type");
  };

  useEffect(() => {
    setMetafield(props.field.value);
    setOldMetafield(props.field.value);
  }, [props.field]);

  //return component
  return (
    <form onSubmit={submitHandler} style={{ display: "flex" }}>
      {props.field.valueType === "BOOLEAN" ? (
        <select value={metafield} required onChange={changeHandler}>
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
      ) : (
        <input
          required
          onChange={(e) => {
            let str = e.target.value;
            if (props.field.valueType === "JSON_STRING") IsJsonString(str);
            changeHandler(e);
          }}
          style={{ borderRadius: "10px" }}
          className={
            props.field.valueType === "JSON_STRING" && metafield && !validJson
              ? "input-error"
              : ""
          }
          type={props.field.valueType === "INTEGER" ? "number" : "text"}
          placeholder="No Metafield"
          value={metafield}
        />
      )}
      {metafield !== oldMetafield ? (
        <div style={{ display: "flex" }}>
          <button
            style={{ height: "48px", marginLeft: "8px" }}
            onClick={cancel}
          >
            Cancel
          </button>
          <button
            className="submit-button"
            style={{ height: "48px", marginLeft: "8px" }}
            type="submit"
          >
            {customerLoading || orderLoading ? <Loader size={24} /> : "Save"}
          </button>
        </div>
      ) : (
        ""
      )}
    </form>
  );
};
export default Section;
