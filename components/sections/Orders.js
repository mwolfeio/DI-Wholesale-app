import Link from "next/link";
import { useState, useEffect } from "react";
import { useQuery } from "react-apollo";
import { gql } from "apollo-boost";

import SectionHeader from "./SectionHeader.js";

var formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const Section = (props) => {
  const [open, setOpen] = useState(true);
  const [ordersArr, setOrdersArr] = useState(props.fields ? props.fields : []);

  const toggleOpen = () => {
    console.log("clicked");
    setOpen(!open);
  };

  console.log("ordersArr: ", ordersArr);

  useEffect(() => {
    setOrdersArr(props.fields ? props.fields : []);
  }, [props.fields]);

  return (
    <section>
      <SectionHeader
        status={open}
        minimize={toggleOpen}
        title={`Orders (${ordersArr.length})`}
      />

      {open ? (
        ordersArr.length < 1 ? (
          <div className="card-container">
            <div className="flex-center-center" style={{ color: "#b0b7c3" }}>
              <b>No Orders</b>
            </div>
          </div>
        ) : (
          <div className="card-container">
            {ordersArr.map((order, i) => {
              console.log(order);
              return (
                <div className="card order-wrapper ">
                  <div className="order-header">
                    <h2>{order.node.name}</h2>
                    <p>{formatter.format(order.node.totalPrice)} spent</p>
                    <p>
                      {order.node.lineItems.edges
                        ? order.node.lineItems.edges.length
                        : "0"}{" "}
                      products
                    </p>
                    <p>{order.node.createdAt}</p>
                    <Link
                      href={`/orders/${order.node.id.replace(
                        "gid://shopify/Order/"
                      )}`}
                    >
                      more >
                    </Link>
                  </div>
                  <div className="virticle-divider"></div>
                  <div
                    style={{ width: "100%" }}
                    className="flex-center-left flex-center-column order-line-item-wrapper"
                  >
                    {order.node.lineItems.edges.map((product) => (
                      <div className="order-product-wrapper">
                        <span className="order-quant-badge flex-center-center">
                          {product.node.quantity}
                        </span>
                        <img src={product.node.image.originalSrc} />
                        <p>{product.node.title}</p>
                        <p className="subtitle">{product.node.originalTotal}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        ""
      )}
    </section>
  );
};
export default Section;
