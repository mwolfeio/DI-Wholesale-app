import { useState } from "react";
import SectionHeader from "./SectionHeader.js";

var formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const CustomerPage = (props) => {
  const [open, setOpen] = useState(true);
  const toggleOpen = () => {
    setOpen(!open);
  };
  return (
    <section style={{ margin: "24px 0 0 0" }}>
      <SectionHeader
        add={{ display: false }}
        status={open}
        minimize={toggleOpen}
        title={`Products (${props.items.length})`}
      />
      {open ? (
        <div className="card-container ">
          {props.items &&
            props.items.map((item) => {
              let product = item.node;
              let url = product.product ? product.product.onlineStoreUrl : "";
              let id = product.product
                ? product.product.id.replace("gid://shopify/Product/", "")
                : "";

              console.log("product: ", product);
              return (
                <div className="card orders-page-product-card">
                  <img
                    src={
                      product.image
                        ? product.image.src
                        : "https://i.stack.imgur.com/y9DpT.jpg"
                    }
                  />
                  <div>
                    <h2>{product.title}</h2>
                    <p className="subtitle">
                      SKU: {product.sku} • {product.vendor}
                    </p>
                    <div className="flex-center-left">
                      <a target="_blank" href={url}>
                        <button
                          style={{
                            height: "28px",
                            padding: "0 12px",
                            marginLeft: "-12px",
                          }}
                          className="text-button"
                        >
                          View
                        </button>
                      </a>
                      <a
                        target="_blank"
                        href={`${process.env.HOST}/admin/products/${id}`}
                      >
                        <button
                          style={{ height: "28px", padding: "0 12px" }}
                          className="text-button"
                        >
                          Edit
                        </button>
                      </a>
                    </div>
                  </div>
                  <p style={{ color: "#b0b7c3" }}>
                    {formatter.format(product.originalUnitPrice)} ×{" "}
                    {product.quantity}
                  </p>
                  <p>
                    <b>{formatter.format(product.originalTotal)}</b>
                  </p>
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

export default CustomerPage;
