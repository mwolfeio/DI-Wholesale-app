import React from "react";
import { useRouter } from "next/router";
import { useQuery } from "react-apollo";
import { gql } from "apollo-boost";

import Link from "next/link";
import ButtonNav from "../../components/ButtonNav.js";
import Loader from "../../components/Loader.js";
import MatafieldSection from "../../components/sections/Metafields.js";
import Orders from "../../components/sections/Orders.js";
import Variants from "../../components/sections/Variants.js";
import SearchTerms from "../../components/sections/SearchTerms.js";

const data = {
  product: {
    description: "",
    id: "gid://shopify/Product/1974208299030",
    images: {
      edges: [],
    },
    metafields: {
      edges: [],
    },
    productType: "",
    minQT: null,
    searchTerms: null,
    status: "ACTIVE",
    storefrontId: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzE5NzQyMDgyOTkwMzA=",
    title: "Rough Snowflake Camisole",
    totalInventory: 0,
    totalVariants: 1,
    onlineStoreUrl: null,
    variants: {
      edges: [
        {
          node: {
            displayName: "Rough Snowflake Camisole - Default Title",
            barcode: null,
            id: "gid://shopify/ProductVariant/19523123216406",
            image: null,
            inventoryQuantity: 0,
            price: "77.00",
            position: 1,
            sku: "",
            storefrontId:
              "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8xOTUyMzEyMzIxNjQwNg==",
          },
        },
      ],
    },
    vendor: "graphql-admin",
    tags: [],
  },
};

var formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const ProductPage = () => {
  const { id } = useRouter().query;
  const globalId = `gid://shopify/Product/${id}`;

  console.log("product data for globalId: ", data);
  if (!data) return <div>no data</div>;

  let product = data.product;
  let matafieldsArr = product.metafields.edges;
  let searchTermsArr =
    product.searchTerms !== null ? product.searchTerms.value.split(",") : [];
  let tagArr = product.tags;
  let varriantArr = product.variants.edges;
  let imgSrc = product.images.edges.length
    ? product.images.edges[0].node.url
    : "https://i.stack.imgur.com/y9DpT.jpg";

  let tag = (
    <h1
      style={{
        marginBottom: 0,
        padding: "8px 24px",
        fontSize: "18px",
        borderRadius: "100px",
      }}
      className={` flex-center-center ${
        product.status === "ACTIVE" ? "drop-ship-tiny-tab" : "warning-tiny-tab"
      }`}
    >
      {product.status.charAt(0).toUpperCase() +
        product.status.slice(1).toLowerCase()}
    </h1>
  );

  return (
    <main>
      <ButtonNav
        cnumb={{
          display: false,
          text: tag,
          globalId: globalId,
        }}
      />
      <div style={{ width: "100%" }}>
        <section className="clear">
          <div className="flex-bottom-btw underline">
            <div className="flex-center-left">
              <img className="prdocut-page-img" src={imgSrc} />
              <div style={{ textAlign: "left" }}>
                <h1>{product.title}</h1>
                <h2 className="subtitle" style={{ fontSize: "16px" }}>
                  <i>
                    {product.vendor} • {product.productType}{" "}
                  </i>
                </h2>
              </div>
            </div>
            <div style={{ textAlign: "right" }} className="flex-right-column ">
              <h1 style={{ fontSize: "20px" }}>
                minimum order:{" "}
                {product.minQT !== null ? product.minQT.value : 1}
              </h1>
              <div style={{ height: "29px" }} className="flex-center-right">
                <a href={product.onlineStoreUrl} target="_blank">
                  <button
                    className="text-button"
                    style={{ height: "28px", margin: " 0 8px 0 0" }}
                  >
                    View
                  </button>
                </a>
                <a
                  href={`https://di-wholesale.myshopify.com/admin/products/${id}`}
                  target="_blank"
                >
                  <button className="text-button" style={{ height: "28px" }}>
                    Edit
                  </button>
                </a>
              </div>
            </div>
          </div>
          <div
            style={{ height: "32px", marginTop: "8px" }}
            className="flex-center-left"
          >
            <p style={{ margin: "0 12px 0 0" }}>Tags:</p>
            {tagArr.map((tagTag) => {
              let strAr = tagTag.split("_");
              return (
                <div
                  className="tinny-tag felx-center-center dissabled-tiny-tab"
                  style={{ marginLeft: "8px" }}
                >
                  {strAr[0]}_
                  <span style={{ color: "#4e5d78" }}>{strAr[1]}</span>
                </div>
              );
            })}
          </div>

          <Variants items={varriantArr} />
        </section>
        <SearchTerms
          globalId={globalId}
          arr={searchTermsArr}
          id={product.searchTerm ? product.searchTerm.id : ""}
        />
        <MatafieldSection
          fields={matafieldsArr}
          type="product"
          globalId={globalId}
        />
      </div>
    </main>
  );
};
export default ProductPage;

// /<h3>Jained {data.customer.lifetimeDuration} ago</h3>
