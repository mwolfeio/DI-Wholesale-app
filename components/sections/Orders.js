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
        minimize={() => setOpen()}
        title={`Orders (${ordersArr.length})`}
      />
      <div className="card-container">
        {open ? (
          ordersArr.map((order, i) => (
            <div className="card flex-center-btw">
              <div>
                <p>{order.node.totalPrice}</p>
                <p>{order.node.totalPrice}</p>
                <p>{order.node.createdAt}</p>
              </div>
              <div className="virticle-divider"></div>
              <div style={{ width: "100%" }} className="flex-center-left">
                {order.lineItems.edgest.map((product) => {
                  <div className="order-product-wrapper">
                    <span className="order-quant-badge">
                      {product.node.quantity}
                    </span>
                    <img src={product.node.imgage.originalSrc} />
                    <p>{product.node.title}</p>
                    <p>{product.node.price}</p>
                  </div>;
                })}
              </div>
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
