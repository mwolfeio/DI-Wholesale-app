import { useState, useEffect } from "react";
import { useMutation } from "react-apollo";
import { gql } from "apollo-boost";

import SectionHeader from "./SectionHeader.js";
import MetafieldInput from "./MetafieldInput.js";

import MoreButton from "../MoreButton.js";

//graphql
const UPDATE_CUSTOMER = gql`
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
const UPDATE_ORDER = gql`
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
const UPDATE_PRODUCT = gql`
  mutation productUpdate(
    $input: ProductInput!
    $namespace: String!
    $key: String!
  ) {
    productUpdate(input: $input) {
      product {
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
const DELETE_FIELD = gql`
  mutation MetafieldDelete($input: MetafieldDeleteInput!) {
    metafieldDelete(input: $input) {
      deletedId
      userErrors {
        field
        message
      }
    }
  }
`;

const Section = (props) => {
  const [open, setOpen] = useState(true);
  const [addCard, setAddCard] = useState(false);
  const [fieldsArr, setFieldsArr] = useState(props.fields ? props.fields : []);

  const [namespace, setNamespace] = useState("");
  const [key, setKey] = useState("");
  const [type, setType] = useState("");
  const [value, setValue] = useState("");
  const [validJson, setValidJason] = useState(true);

  console.log("fieldsArr: ", fieldsArr);

  //Query
  const [customerUpdate, { customerLoading, customerError, customerData }] =
    useMutation(UPDATE_CUSTOMER);
  const [orderUpdate, { orderLoading, orderError, orderData }] =
    useMutation(UPDATE_ORDER);
  const [productUpdate, { productLoading, productError, productData }] =
    useMutation(UPDATE_PRODUCT);
  const [deleteField, { load, erro, da }] = useMutation(DELETE_FIELD);

  //handlers
  const toggleOpen = () => {
    setOpen(!open);
  };
  const addMetafield = () => {
    console.log("clicked");
    setAddCard(true);
  };
  const submitHandler = (e) => {
    e.preventDefault();
    if (type === "JSON_STRING" && !validJson) return;
    let payload = {
      variables: {
        namespace: namespace,
        key: key,
        input: {
          id: props.globalId,
          metafields: {
            namespace: namespace,
            key: key,
            value: value,
            type: type,
          },
        },
      },
    };
    console.log("for this ", props.type, " submitting: ", payload);

    if (props.type === "order") {
      orderUpdate(payload)
        .then((returnedData) =>
          updateState(returnedData.data.orderUpdate.order.metafield)
        )
        .catch((err) => console.log(err));
    } else if (props.type === "product") {
      productUpdate(payload)
        .then((returnedData) =>
          updateState(returnedData.data.productUpdate.product.metafield)
        )
        .catch((err) => console.log(err));
    } else if (props.type === "customer") {
      customerUpdate(payload)
        .then((returnedData) =>
          updateState(returnedData.data.customerUpdate.customer.metafield)
        )
        .catch((err) => console.log(err));
    } else console.log("no type specified or unrecognized type");
  };
  const deleteMetafield = (id) => {
    let payload = {
      variables: {
        input: {
          id: id,
        },
      },
    };
    console.log("deleting: ", payload);
    deleteField(payload)
      .then(() => {
        setFieldsArr(fieldsArr.filter((field) => field.node.id !== id));
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const updateState = (newdata) => {
    console.log("submitted! ", newdata);
    let newField = {
      node: newdata,
    };

    newField.node.type = type;

    setFieldsArr([newField, ...fieldsArr]);
    setNamespace("");
    setKey("");
    setType("");
    setValue("");
    setAddCard(false);
  };
  const IsJsonString = (str) => {
    try {
      JSON.parse(str);
    } catch (e) {
      return setValidJason(false);
    }
    setValidJason(true);
  };

  useEffect(() => {
    setFieldsArr(props.fields ? props.fields : []);
  }, [props.fields]);

  return (
    <section>
      <SectionHeader
        add={{ display: true, func: addMetafield }}
        status={open}
        minimize={toggleOpen}
        title={`Metafields (${fieldsArr.length})`}
      />
      {open ? (
        <div className="card-container">
          {addCard && (
            <form onSubmit={submitHandler} className="card input-card">
              <div className="flex-center-btw">
                <div className="flex-center-left">
                  <p>
                    <span className="subtitle" style={{ marginRight: "8px" }}>
                      Namespace:{" "}
                    </span>
                  </p>
                  <input
                    required
                    type="text"
                    placeholder="add a name"
                    value={namespace}
                    onChange={(e) => setNamespace(e.target.value)}
                  />
                  <p style={{ marginLeft: "16px" }}>
                    <span className="subtitle" style={{ marginRight: "8px" }}>
                      Key:{" "}
                    </span>
                  </p>
                  <input
                    required
                    type="text"
                    placeholder="add a key"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                  />
                </div>

                <div className="flex-center-left">
                  <p style={{ marginLeft: "16px" }}>
                    <span className="subtitle" style={{ marginRight: "8px" }}>
                      Type:{" "}
                    </span>
                  </p>
                  <select
                    value={type}
                    required
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option value="" disabled selected>
                      Select type
                    </option>
                    <option value="STRING">String</option>
                    <option value="INTEGER">Integer</option>
                    <option value="JSON_STRING">JSON String</option>
                    <option value="BOOLEAN">Boolean</option>
                  </select>
                </div>
              </div>
              {type === "BOOLEAN" ? (
                <select
                  value={value}
                  required
                  style={{ margin: "16px 0" }}
                  onChange={(e) => setValue(e.target.value)}
                >
                  <option value="true">True</option>
                  <option value="false">False</option>
                </select>
              ) : (
                <input
                  required
                  className={
                    type === "JSON_STRING" && value && !validJson
                      ? "input-error"
                      : ""
                  }
                  style={{ margin: "16px 0" }}
                  type={type === "INTEGER" ? "number" : "text"}
                  placeholder="Add a value"
                  value={value}
                  onChange={(e) => {
                    let str = e.target.value;
                    if (type === "JSON_STRING") IsJsonString(str);
                    setValue(str);
                  }}
                />
              )}
              <div className="flex-center-right">
                <div className="flex-center-center">
                  <button
                    className=""
                    onClick={() => setAddCard(false)}
                    style={{ marginRight: "8px" }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="submit-button">
                    Submit
                  </button>
                </div>
              </div>
            </form>
          )}

          {fieldsArr.map((metafield) => {
            let namespace = metafield.node.namespace;
            let metafieldKey = metafield.node.key;

            return (
              <div className="card">
                <div
                  className="flex-center-btw"
                  style={{ marginBottom: "8px" }}
                >
                  <p>
                    <span className="subtitle" style={{ marginRight: "8px" }}>
                      Namespace:{" "}
                    </span>{" "}
                    {namespace}{" "}
                    <span
                      className="subtitle"
                      style={{ margin: " 0 8px 0 16px" }}
                    >
                      key:{" "}
                    </span>
                    {metafieldKey}
                  </p>
                  <div className="flex-center-center">
                    <p className="subtitle">{metafield.node.type}</p>
                    <MoreButton>
                      <span onClick={() => deleteMetafield(metafield.node.id)}>
                        Delete
                      </span>
                    </MoreButton>
                  </div>
                </div>
                <MetafieldInput
                  globalId={props.globalId}
                  field={metafield.node}
                  type={props.type}
                />
              </div>
            );
          })}
        </div>
      ) : (
        ""
      )}
    </section>
  );
};
export default Section;
