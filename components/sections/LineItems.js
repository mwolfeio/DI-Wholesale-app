import { useState } from "react";
import SectionHeader from "./SectionHeader.js";

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
        <div className="card-container">
          {props.items &&
            props.items.map((item) => {
              let product = item.node;
              console.log("product: ", product);
              return (
                <div className="card flex-top-left orders-page-product-card">
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
                  </div>
                  <p style={{ color: "#b0b7c3", margin: "0 16px" }}>
                    {product.originalUnitPrice} × {product.quantity}
                  </p>
                  <p>
                    <b>{product.originalTotal}</b>
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
