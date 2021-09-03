import React from "react";
import { useQuery } from "react-apollo";
import { gql } from "apollo-boost";

import SectionHeader from "./SectionHeader.js";

const Section = (props) => {
  let fieldsArr = props.fields ? props.fields : [];

  // console.log("metafirlds from metafields seciton: ", fieldsArr);
  return (
    <section>
      <SectionHeader title="Metafields" />
      <div className="card-container">
        {fieldsArr.map((metafield) => (
          <div className="card">
            <p>
              {metafield.node.namespace} {metafield.node.key}
            </p>
            <p>{metafield.node.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
export default Section;
