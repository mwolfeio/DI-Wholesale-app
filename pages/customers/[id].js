import React from "react";
import { useRouter } from "next/router";
import { useQuery } from "react-apollo";
import { gql } from "apollo-boost";

import Link from "next/link";
import ButtonNav from "../../components/ButtonNav.js";
import Loader from "../../components/Loader.js";
import MatafieldSection from "../../components/sections/Metafields.js";
import Orders from "../../components/sections/Orders.js";

const GET_CUSTOMER = gql`
  query getCustomer($id: ID!) {
    customer(id: $id) {
      defaultAddress {
        address1
        address2
        city
        company
        country
        zip
        provinceCode
        province
        phone
      }
      acceptsMarketing
      createdAt
      addresses(first: 1) {
        address1
        city
        company
        country
        countryCode
        countryCodeV2
        phone
        provinceCode
        province
        zip
      }
      displayName
      email
      firstName
      hasNote
      hasTimelineComment
      image {
        src
      }
      lastName
      lifetimeDuration
      marketingOptInLevel
      metafields(first: 10) {
        edges {
          node {
            id
            namespace
            key
            value
          }
        }
      }
      note
      orders(first: 5) {
        edges {
          node {
            id
            totalPrice
            lineItems(first: 4) {
              edges {
                node {
                  image(maxHeight: 500, maxWidth: 500) {
                    originalSrc
                  }
                  quantity
                  sku
                  title
                  vendor
                }
              }
            }
            createdAt
          }
        }
      }
      phone
      ordersCount
      tags
      taxExempt
      taxExemptions
      totalSpent
    }
  }
`;

var formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const CustomerPage = () => {
  const { id } = useRouter().query;
  let globalId = `gid://shopify/Customer/${id}`;

  const { loading, error, data } = useQuery(GET_CUSTOMER, {
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

  let matafieldsArr = data.customer.metafields.edges;
  let ordersArr = data.customer.orders.edges;
  let customerNumberObj = matafieldsArr.find(
    (o) => o.node.namespace === "Customer" && o.node.key === "Number"
  );
  let resaleNumberObj = matafieldsArr.find(
    (o) => o.node.namespace === "Resale" && o.node.key === "Number"
  );
  let cusNumb = customerNumberObj ? customerNumberObj.node.value : "";

  return (
    <main>
      <ButtonNav
        back="customers"
        cnumb={{
          display: true,
          cnumbObj: customerNumberObj ? customerNumberObj.node : {},
          globalId: globalId,
        }}
      />
      <div style={{ width: "100%" }}>
        <section className="clear">
          <div className="flex-bottom-btw underline">
            <h1 className>
              {data.customer.firstName} {data.customer.lastName}
            </h1>
            <h1 style={{ fontSize: "20px" }}>
              {formatter.format(data.customer.totalSpent)} spent
            </h1>
          </div>
          <div className="flex-top-btw">
            <div style={{ display: "table" }}>
              <h3 stule>Shopify id: {id.replace("$")}</h3>
              {resaleNumberObj ? (
                <h3 stule>Resale Number: {resaleNumberObj.node.value}</h3>
              ) : (
                ""
              )}
              <h3 stule>Email: {data.customer.email}</h3>
              <h3>
                Phone:{" "}
                {data.customer.phone
                  ? data.customer.phone
                  : data.customer.defaultAddress.phone}
              </h3>
            </div>
            <div style={{ textAlign: "right" }}>
              <h3 style={{ textAlign: "right" }}>
                {data.customer.ordersCount} Orders <br />
                Account created <br />
                {data.customer.lifetimeDuration} ago
              </h3>
            </div>
          </div>
        </section>
        <Orders fields={ordersArr} />
        <MatafieldSection fields={matafieldsArr} customerId={globalId} />
        <section className="disabled">Wishlist</section>
        <section className="disabled">Interests</section>
        <section className="disabled">Reviews</section>
        <section className="disabled">Alerts</section>
        <section className="disabled">Rewards</section>
      </div>
    </main>
  );
};
export default CustomerPage;
