import { useState } from "react";
import { useQuery } from "react-apollo";
import { gql } from "apollo-boost";

import SectionHeader from "./SectionHeader.js";

const Section = (props) => {
  const [open, setOpen] = useState(true);
  let ordersArr = props.fields ? props.fields : [];

  const toggleOpen = () => {
    console.log("clicked");
    setOpen(!open);
  };

  console.log("ordersArr: ", ordersArr);

  return (
    <section>
      <SectionHeader
        status={open}
        minimize={toggleOpen}
        title={`Orders (${ordersArr.length})`}
      />
      <div className="card-container">
        {open ? (
          ordersArr.length < 1 ? (
            <div className="flex-center-center">No Orders</div>
          ) : (
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
          )
        ) : (
          ""
        )}
      </div>
    </section>
  );
};
export default Section;
