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

const GET_PRODUCT = gql`
  query getProduct($id: ID!) {
    product(id: $id) {
      description
      id
      images(first: 10, maxHeight: 500, maxWidth: 500) {
        edges {
          node {
            src
          }
        }
      }
      metafields(first: 50) {
        edges {
          node {
            id
            key
            namespace
            value
            valueType
          }
        }
      }
      productType
      status
      storefrontId
      title
      totalInventory
      totalVariants
      variants(first: 50) {
        edges {
          node {
            displayName
            barcode
            id
            image(maxHeight: 40, maxWidth: 40) {
              src
            }
            inventoryQuantity
            price
            position
            sku
            storefrontId
          }
        }
      }
      vendor
      tags
    }
  }
`;

var formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const CustomerPage = () => {
  const { id } = useRouter().query;
  const globalId = `gid://shopify/Product/${id}`;

  //Querys
  const { loading, error, data } = useQuery(GET_PRODUCT, {
    fetchPolicy: "no-cache",
    variables: { id: globalId },
  });

  if (loading) {
    return (
      <main>
        <ButtonNav back="customers" />
        <div
          style={{ height: "100%", width: "100%" }}
          className="flex-center-center"
        >
          <Loader />
        </div>
      </main>
    );
  }
  if (error) {
    return (
      <main>
        <ButtonNav back="customers" />
        <div
          style={{ height: "100%", width: "100%" }}
          className="flex-center-center"
        >
          {error.message}
        </div>
      </main>
    );
  }

  console.log(data);

  let product = data.product;
  let matafieldsArr = product.metafields.edges;
  let tagArr = product.tags;
  let varriantArr = product.variants.edges;
  let imgSrc = product.imgSrc
    ? product.imgSrc
    : "https://i.stack.imgur.com/y9DpT.jpg";

  let tag = (
    <h1
      style={{ marginBottom: 0, padding: "8px 24px", borderRadius: "100px" }}
      className={` flex-center-center${
        product.status === "ACTIVE" ? "drop-ship-tiny-tab" : "warning-tiny-tab"
      }`}
    >
      {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
    </h1>
  );

  return (
    <main>
      <ButtonNav
        back="customers"
        cnumb={{
          display: false,
          text: tag,
          globalId: globalId,
        }}
      />
      <div style={{ width: "100%" }}>
        <section className="clear">
          <div className="flex-bottom-btw underline">
            <div style={{ textAlign: "left" }}>
              <img cassName="prdocut-page-img" src={imgSrc} />
              <div style={{ textAlign: "left" }}>
                <h1>{product.title}</h1>
                <h2 className="subtitle" style={{ fontSize: "16px" }}>
                  <i>{product.type}</i>
                </h2>
              </div>
            </div>
            <div style={{ textAlign: "right" }} className="flex-right-column ">
              <h1 style={{ fontSize: "20px" }}>{product.vendor}</h1>
              <div style={{ height: "29px" }} className="flex-center-right">
                {tagArr.map((tagTag) => (
                  <div
                    className="tinny-tag felx-center-center dissabled-tiny-tab"
                    style={{ marginLeft: "8px" }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <Variants items={varriantArr} />
        <MatafieldSection
          fields={matafieldsArr}
          type="product"
          globalId={globalId}
        />
      </div>
    </main>
  );
};
export default CustomerPage;
