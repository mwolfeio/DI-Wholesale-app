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
        title={`Product Variants (${props.items.length})`}
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
              let img = product.image
                ? product.image.src
                : "https://i.stack.imgur.com/y9DpT.jpg";

              console.log("product: ", product);
              return (
                <div className="card product-page-product-card">
                  <img src={img} />
                  <div>
                    <h2>{product.displayName}</h2>
                    <p className="subtitle">
                      SKU: {product.sku} • id: {product.id}
                    </p>
                    <div className="flex-center-left">
                      {product.status === "ACTIVE" ? (
                        <div className="tinny-tag flex-center-center drop-ship-tiny-tab">
                          Active
                        </div>
                      ) : (
                        <div className="tinny-tag flex-center-center complete-tiny-tab">
                          {product.status.charAt(0).toUpperCase() +
                            product.status.slice(1).toLowerCase()}
                        </div>
                      )}
                    </div>
                  </div>
                  <p style={{ color: "#b0b7c3" }}>
                    {product.selectedOptions.value}
                    <span className="subtitle">
                      {product.selectedOptions.name}
                    </span>
                  </p>
                  <p style={{ color: "#b0b7c3" }}>
                    {formatter.format(product.price)}
                  </p>
                  <p>{product.inventoryQuantity}</p>
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
