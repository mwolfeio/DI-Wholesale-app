import { useState } from "react";
import { useQuery } from "react-apollo";
import { gql } from "apollo-boost";

import SectionHeader from "./SectionHeader.js";

const Section = (props) => {
  const [open, setOpen] = useState(true);
  let ordersArr = props.fields ? props.fields : [];

  return (
    <section>
      <SectionHeader
        status={open}
        minimize={setOpen}
        title={`Orders (${ordersArr.length})`}
      />
      <div className="card-container">
        {open ? (
          ordersArr.map((order, i) => (
            <div className="card">
              <p>{i}</p>
            </div>
          ))
        ) : (
          <div className="flex-center-center">No Orders</div>
        )}
      </div>
    </section>
  );
};
export default Section;
