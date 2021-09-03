import React from "react";

import { useQuery } from "react-apollo";
import { gql } from "apollo-boost";

const Section = (props) => {
  let fieldsArr = props.fields ? props.fields : [];
  return (
    <section>
      <h2>Metafields</h2>
      <div className="card-container">
        {fieldsArr.map((metafield) => (
          <div className="card">
            <p>{metafield.node.id}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
export default Section;
