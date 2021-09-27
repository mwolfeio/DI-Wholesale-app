import { useState } from "react";
import { useQuery } from "react-apollo";
import { gql } from "apollo-boost";

import SectionHeader from "./SectionHeader.js";
import MetafieldInput from "./MetafieldInput.js";

const Section = (props) => {
  const [open, setOpen] = useState(true);
  const [addCard, setAddCard] = useState(false);
  let fieldsArr = props.fields ? props.fields : [];

  const toggleOpen = () => {
    setOpen(!open);
  };

  const addMetafield = () => {
    console.log("clicked");
    setAddCard(true);
  };

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
            <div className="card">
              <div className="flex-center-btw">
                <div className="flex-center-left">
                  <p>
                    <span className="subtitle" style={{ marginRight: "8px" }}>
                      Namespace:{" "}
                    </span>
                  </p>
                  <input type="text" placeholder="" />
                  <p style={{ marginLeft: "16px" }}>
                    <span className="subtitle" style={{ marginRight: "8px" }}>
                      key:{" "}
                    </span>
                  </p>
                  <input type="text" placeholder="" />
                </div>

                <div className="flex-center-left">
                  <p style={{ marginLeft: "16px" }}>
                    <span className="subtitle">key: </span>
                  </p>
                  <select>
                    <option value="STRING">String</option>
                    <option value="INTEGER">Integer</option>
                    <option value="JSON_STRING">JSON String</option>
                    <option value="BOOLEAN">Boolean</option>
                  </select>
                </div>
              </div>
              <input type="text" placeholder="Add a value" />
              <div className="flex-center-right">
                <div className="flex-center-center">
                  <button className="" onClick={() => setAddCard(false)}>
                    Cancel
                  </button>
                  <button className="submit-button">Submit</button>
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
                  <p className="subtitle">{metafield.node.valueType}</p>
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
