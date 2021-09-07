import { useState } from "react";
import { useQuery } from "react-apollo";
import { gql } from "apollo-boost";

import SectionHeader from "./SectionHeader.js";
import MetafieldInput from "./MetafieldInput.js";

const Section = (props) => {
  const [open, setOpen] = useState(true);
  let fieldsArr = props.fields ? props.fields : [];
  const toggleOpen = () => {
    console.log("clicked");
    setOpen(!open);
  };

  // console.log("metafirlds from metafields seciton: ", fieldsArr);
  return (
    <section>
      <SectionHeader
        status={open}
        minimize={toggleOpen}
        title={`Metafields (${fieldsArr.length})`}
      />
      {open ? (
        <div className="card-container">
          {fieldsArr.map((metafield) => (
            <div className="card">
              <p>
                {metafield.node.namespace} {metafield.node.key}
              </p>
              <MetafieldInput
                value={metafield.node.value}
                namespace={metafield.node.namespace}
                key={metafield.node.key}
                MetafieldId={metafield.node.id}
                custoemrId={props.customerId}
              />
            </div>
          ))}
        </div>
      ) : (
        ""
      )}
    </section>
  );
};
export default Section;
