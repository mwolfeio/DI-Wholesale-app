import { useState, useEffect } from "react";
import { useMutation } from "react-apollo";
import { gql } from "apollo-boost";

import SectionHeader from "./SectionHeader.js";
import MetafieldInput from "./MetafieldInput.js";

import MoreButton from "../MoreButton.js";

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
// const UPDATE_PRODUCT_VARIANT = gql`
//   mutation productUpdate(
//     $input: ProductInput!
//     $namespace: String!
//     $key: String!
//   ) {
//     productUpdate(input: $input) {
//       product {
//         variants {
//           edges {
//             node {
//               metafield(namespace: $namespace, key: $key) {
//                 id
//                 namespace
//                 key
//                 value
//               }
//             }
//           }
//         }
//       }
//       userErrors {
//         field
//         message
//       }
//     }
//   }
// `;
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
  const regex = new RegExp(`(?(DEFINE)
# Note that everything is atomic, JSON does not need backtracking if it's valid
# and this prevents catastrophic backtracking
(?<json>(?>\s*(?&object)\s*|\s*(?&array)\s*))
(?<object>(?>\{\s*(?>(?&pair)(?>\s*,\s*(?&pair))*)?\s*\}))
(?<pair>(?>(?&STRING)\s*:\s*(?&value)))
(?<array>(?>\[\s*(?>(?&value)(?>\s*,\s*(?&value))*)?\s*\]))
(?<value>(?>true|false|null|(?&STRING)|(?&NUMBER)|(?&object)|(?&array)))
(?<STRING>(?>"(?>\\(?>["\\\/bfnrt]|u[a-fA-F0-9]{4})|[^"\\\0-\x1F\x7F]+)*"))
(?<NUMBER>(?>-?(?>0|[1-9][0-9]*)(?>\.[0-9]+)?(?>[eE][+-]?[0-9]+)?))
)
\A(?&json)\z`);

  console.log("fieldsArr: ", fieldsArr);

  //Query
  const [producteUpdate, { producteLoading, producteError, producteData }] =
    useMutation(UPDATE_PRODUCT);
  // const [orderUpdate, { orderLoading, orderError, orderData }] =
  //   useMutation(UPDATE_ORDER);
  const [deleteField, { load, erro, da }] = useMutation(DELETE_FIELD);

  //handlers
  const toggleOpen = () => {
    setOpen(!open);
  };
  const addMetafield = () => {
    console.log("clicked");
    setAddCard(true);
  };
  const submitHandler = () => {
    e.preventDefault();
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
            valueType: type,
          },
        },
      },
    };
    console.log("for this ", props.type, " submitting: ", payload);

    if (props.type === "product") {
      orderUpdate(payload)
        .then((returnedData) =>
          updateState(
            returnedData.data.producteUpdateUpdate.producteUpdate.metafield
          )
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

    newField.node.valueType = type;

    setFieldsArr([newField, ...fieldsArr]);
    setNamespace("");
    setKey("");
    setType("");
    setValue("");
    setAddCard(false);
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
                  style={{ margin: "16px 0" }}
                  type={type === "INTEGER" ? "number" : "text"}
                  placeholder="Add a value"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
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
                    <p className="subtitle">{metafield.node.valueType}</p>
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