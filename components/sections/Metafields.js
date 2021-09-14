import { useState } from "react";
import { useQuery } from "react-apollo";
import { gql } from "apollo-boost";

import SectionHeader from "./SectionHeader.js";
import MetafieldInput from "./MetafieldInput.js";

const Section = (props) => {
  const [open, setOpen] = useState(true);
  let fieldsArr = props.fields ? props.fields : [];

  const toggleOpen = () => {
    setOpen(!open);
  };

  const addMetafield = () => {
    console.log("clicked");
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
          {fieldsArr.map((metafield) => {
            let namespace = metafield.node.namespace;
            let metafieldKey = metafield.node.key;

            return (
              <div className="card">
                <div className="felx-center-btw">
                  <p>
                    {namespace}.{metafieldKey}
                  </p>
                  <p className="subtitle">metafield.node.type;</p>
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

// value={metafield.node.value}
// namespace={namespace}
// metafieldKey={metafieldKey}
// MetafieldId={metafield.node.id}
// custoemrId={props.customerId}
