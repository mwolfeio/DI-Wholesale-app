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
    <section>
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

              if (!product) return <p>This product has no variants</p>;

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
                    <h2 style={{ lineHeight: "22px" }}>
                      {product.displayName}
                    </h2>
                    <p className="subtitle">
                      SKU: {product.sku} • ID:{" "}
                      {product.id.replace("gid://shopify/ProductVariant/", "")}
                    </p>

                    <div className="flex-center-left">
                      Position: {product.position}
                    </div>
                  </div>
                  <div className="flex-center-column">
                    <p style={{ lineHeight: "22px" }}>
                      {product.selectedOptions
                        ? product.selectedOptions.value
                        : "Vlaue"}
                    </p>
                    <p className="subtitle">
                      {product.selectedOptions
                        ? product.selectedOptions.name
                        : "Attribute"}
                    </p>
                  </div>
                  <div className="flex-center-column">
                    <p style={{ lineHeight: "22px" }}>
                      {formatter.format(product.price)}
                    </p>
                    <p className="subtitle">Price</p>
                  </div>

                  <div className="flex-center-column">
                    <p style={{ lineHeight: "22px" }}>
                      {product.inventoryQuantity}
                    </p>
                    <p className="subtitle">Quantity</p>
                  </div>
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
