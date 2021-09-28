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

              let date = new Date(order.node.createdAt);
              return (
                <div className="card order-wrapper ">
                  <div className="order-header flex-btw-column">
                    <div>
                      <h2>Order: {order.node.name}</h2>
                      <p className="subtitle" style={{ fontSize: "14px" }}>
                        {date.toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <p className="subtitle" style={{ fontSize: "14px" }}>
                        {formatter.format(order.node.totalPrice)} (
                        {order.node.lineItems.edges
                          ? order.node.lineItems.edges.length
                          : "0"}{" "}
                        item
                        {order.node.lineItems.edges &&
                        order.node.lineItems.edges.length > 1
                          ? "s"
                          : ""}
                        )
                      </p>
                      <div
                        className="flex-center-left"
                        style={{ marginBottom: "16px" }}
                      >
                        {order.node.fulfillable ? (
                          <div className="tinny-tag active-tiny-tab flex-center-center">
                            Unfulfilled
                          </div>
                        ) : (
                          <div className="tinny-tag flex-center-center">
                            Fulfilled
                          </div>
                        )}
                        {order.node.metafield.value === "true" && (
                          <div
                            style={{ marginLeft: "8px" }}
                            className="tinny-tag drop-ship-tiny-tab flex-center-center"
                          >
                            Drp Ship
                          </div>
                        )}
                      </div>
                      <div
                        style={{
                          padding: "8px",
                          borderRadius: "8px",
                          background: "#f4f6f8",
                          marginBottom: "8px",
                        }}
                      >
                        <p>Address:</p>

                        {order.node.shippingAddress.address1 && (
                          <p
                            className="subtitle"
                            style={{ fontSize: "14px", lineHeight: "20px" }}
                          >
                            {order.node.shippingAddress.address1}
                            <br />
                          </p>
                        )}
                        {order.node.shippingAddress.address2 && (
                          <p
                            className="subtitle"
                            style={{ fontSize: "14px", lineHeight: "20px" }}
                          >
                            {order.node.shippingAddress.address2}
                            <br />
                          </p>
                        )}
                        {order.node.shippingAddress.city && (
                          <p
                            className="subtitle"
                            style={{ fontSize: "14px", lineHeight: "20px" }}
                          >
                            {order.node.shippingAddress.city},{" "}
                            {order.node.shippingAddress.provinceCode}
                            <br />
                          </p>
                        )}
                        {order.node.shippingAddress.zip && (
                          <p
                            className="subtitle"
                            style={{ fontSize: "14px", lineHeight: "20px" }}
                          >
                            {order.node.shippingAddress.zip},{" "}
                            {order.node.shippingAddress.countryCode}
                          </p>
                        )}
                      </div>
                    </div>
                    <Link
                      href={`/orders/${order.node.id.replace(
                        "gid://shopify/Order/",
                        ""
                      )}`}
                    >
                      <button className="text-button" style={{ width: "100%" }}>
                        more
                      </button>
                    </Link>
                  </div>
                  <div className="virticle-divider"></div>
                  <div
                    style={{ width: "100%", paddingBottom: "16px" }}
                    className="flex-top-left order-line-item-wrapper"
                  >
                    {order.node.lineItems.edges.map((product) => (
                      <a
                        target="blank"
                        href={`${
                          process.env.HOST
                        }/admin/products/${product.node.product.id.replace(
                          "gid://shopify/Product/",
                          ""
                        )}`}
                        style={{ textDecoration: "none" }}
                        className="order-product-wrapper flex-center-column"
                      >
                        <span className="order-quant-badge active-tiny-tab flex-center-center">
                          QT: {product.node.quantity}
                        </span>
                        <img src={product.node.image.originalSrc} />
                        <p style={{ margin: "8px 0" }}>{product.node.title}</p>
                        <p className="subtitle">
                          {formatter.format(product.node.originalUnitPrice)}
                        </p>
                      </a>
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
