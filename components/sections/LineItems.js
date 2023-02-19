import { useState } from "react";
import SectionHeader from "./SectionHeader.js";
import Link from "next/link";

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
              let img =
                product.variant && product.variant.image
                  ? product.variant.image.url
                  : product.image
                  ? product.image.url
                  : "https://i.stack.imgur.com/y9DpT.jpg";

              console.log("product: ", product);
              return (
                <Link href={`/products/${id}`}>
                  <div className="card orders-page-product-card">
                    <img src={img} />
                    <div>
                      <h2>{product.title}</h2>
                      <p className="subtitle">
                        SKU: {product.sku} • {product.variantTitle} •{" "}
                        {product.vendor}
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
                          href={`https://di-wholesale.myshopify.com/admin/products/${id}`}
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
                      {formatter.format(
                        product.originalUnitPriceSet?.shopMoney?.amount ?? 0
                      )}{" "}
                      × {product.quantity}
                    </p>
                    <p>
                      <b>
                        {formatter.format(
                          product.originalTotalSet?.shopMoney?.amount ?? 0
                        )}
                      </b>
                    </p>
                  </div>
                </Link>
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
