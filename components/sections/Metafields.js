import { useState, useEffect } from "react";
import { useMutation } from "react-apollo";
import { gql } from "apollo-boost";

import SectionHeader from "./SectionHeader.js";
import MetafieldInput from "./MetafieldInput.js";

//graphql
const UPDATE_ITEM = gql`
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
  // let fieldsArr = props.fields ? props.fields : [];

  console.log("fieldsArr: ", fieldsArr);

  //Query
  const [itemUpdate, { loading, error, data }] = useMutation(UPDATE_ITEM);
  const [deleteField, { load, erro, da }] = useMutation(DELETE_FIELD);

  if (error) console.log("error: ", error);

  //handlers
  const toggleOpen = () => {
    setOpen(!open);
  };
  const addMetafield = () => {
    console.log("clicked");
    setAddCard(true);
  };
  const submitNewMetafield = () => {
    let payload = {
      variables: {
        namespace: namespace,
        key: key,
        input: {
          id: props.customerId,
          metafields: {
            namespace: namespace,
            key: key,
            value: value,
            valueType: type,
          },
        },
      },
    };

    console.log("submitting: ", payload);
    itemUpdate(payload)
      .then((returnedData) => {
        console.log("submitted! ", returnedData);
        let newField = {
          node: returnedData.data.customerUpdate.customer.metafield,
        };

        setFieldsArr([newField, ...fieldsArr]);
      })
      .catch((err) => {
        console.log(err);
      });
    // setFieldsArr([...fieldsArr, payload.variables]);
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
        setFieldsArr(fieldsArr.filter((field) => field.node.id === id));
      })
      .catch((err) => {
        console.log(err);
      });
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
            <div className="card input-card">
              <div className="flex-center-btw">
                <div className="flex-center-left">
                  <p>
                    <span className="subtitle" style={{ marginRight: "8px" }}>
                      Namespace:{" "}
                    </span>
                  </p>
                  <input
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
                    type="text"
                    placeholder="add a type"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                  />
                </div>

                <div className="flex-center-left">
                  <p style={{ marginLeft: "16px" }}>
                    <span className="subtitle">Type: </span>
                  </p>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option value="" disabled selected>
                      Choose a type
                    </option>
                    <option value="STRING">String</option>
                    <option value="INTEGER">Integer</option>
                    <option value="JSON_STRING">JSON String</option>
                    <option value="BOOLEAN">Boolean</option>
                  </select>
                </div>
              </div>
              <input
                style={{ margin: "16px 0" }}
                type="text"
                placeholder="Add a value"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
              <div className="flex-center-right">
                <div className="flex-center-center">
                  <button
                    className=""
                    onClick={() => setAddCard(false)}
                    style={{ marginRight: "8px" }}
                  >
                    Cancel
                  </button>
                  <button
                    className="submit-button"
                    onClick={submitNewMetafield}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          )}

          {fieldsArr.map((metafield) => {
            let namespace = metafield.node.namespace;
            let metafieldKey = metafield.node.key;

            return (
              <div className="card">
                <div className="flex-center-btw">
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
                    <p className="subtitle">{metafield.node.valueType}</p>
                    <button onClick={() => deleteMetafield(metafield.node.id)}>
                      Delete
                    </button>
                  </div>
                </div>
                <MetafieldInput
                  customerId={props.customerId}
                  field={metafield.node}
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
