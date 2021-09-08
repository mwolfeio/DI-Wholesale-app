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

            console.log("metafield Parent = ", metafield);
            console.log("Metafield parent namespace = ", namespace);
            console.log("Metafield parent metafieldKey = ", metafieldKey);

            return (
              <div className="card">
                <p>
                  {namespace} {metafieldKey}
                </p>
                <MetafieldInput
                  value={metafield.node.value}
                  namespace={namespace}
                  metafieldKey={metafieldKey}
                  MetafieldId={metafield.node.id}
                  custoemrId={props.customerId}
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
