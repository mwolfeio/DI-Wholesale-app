import React from "react";
import { useRouter } from "next/router";
import { useQuery } from "react-apollo";
import { gql } from "apollo-boost";

import Link from "next/link";
import ButtonNav from "../../components/ButtonNav.js";
import Loader from "../../components/Loader.js";
import MatafieldSection from "../../components/sections/Metafields.js";
import Orders from "../../components/sections/Orders.js";

const GET_ORDER = gql`
  query getOrder($id: ID!) {
    order(id: $id) {
      billingAddress {
        formatted(withCompany: false, withName: false)
      }
      createdAt
      currentSubtotalLineItemsQuantity
      customer {
        firstName
        id
        lastName
        email
        phone
        defaultAddress {
          company
          phone
        }
        ordersCount
        totalSpent
      }
      displayFulfillmentStatus
      email
      fulfillable
      fullyPaid
      id
      lineItems(first: 50) {
        edges {
          cursor
          node {
            image(maxWidth: 500, maxHeight: 500) {
              src
            }
            fulfillmentStatus
            name
            originalTotal
            originalUnitPrice
            quantity
            sku
            title
            vendor
          }
        }
      }
      metafields(first: 20) {
        edges {
          node {
            value
            key
            id
            namespace
            valueType
          }
        }
      }
      name
      phone
      shippingAddress {
        formatted(withCompany: true, withName: true)
      }
      totalPrice
      unpaid
    }
  }
`;

var formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const CustomerPage = () => {
  const { id } = useRouter().query;
  let globalId = `gid://shopify/Order/${id}`;

  const { loading, error, data } = useQuery(GET_ORDER, {
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

  console.log("order: ", data);
  let matafieldsArr = data.order.metafields.edges;
  let lineItemArr = data.order.customer.lineItems.edges;

  // let resaleNumberObj = matafieldsArr.find(
  //   (o) => o.node.namespace === "Resale Number" && o.node.key === "res_no"
  // );
  // let cusNumb = customerNumberObj ? customerNumberObj.node.value : "";

  return (
    <main>
      <ButtonNav
        back="customers"
        cnumb={{
          display: false,
          text: data.order.name,
          globalId: globalId,
        }}
      />
      <div style={{ width: "100%" }}>
        <section className="clear">
          <div className="flex-bottom-btw underline">
            <h1 className>
              {data.order.customer.firstName} {data.order.customer.lastName}
            </h1>
            <h1 style={{ fontSize: "20px" }}>
              {formatter.format(data.order.totalPrice)} spent
            </h1>
          </div>
          <div className="flex-top-btw">
            <div style={{ display: "table" }}>
              <h3>Shopify id: {id}</h3>
              {resaleNumberObj ? <h3 stule>Info</h3> : ""}
              <h3 stule>Email: {data.order.customer.email}</h3>
              <h3>
                Phone:{" "}
                {data.order.customer.phone
                  ? data.order.customer.phone
                  : data.order.customer.defaultAddress.phone}
              </h3>
            </div>
            <div style={{ textAlign: "right" }}>
              <h3 style={{ textAlign: "right" }}>
                {data.order.customer.ordersCount} Orders <br />
                <br />
                {data.order.customer.totalSpent} spent
              </h3>
            </div>
          </div>
        </section>

        <MatafieldSection fields={matafieldsArr} customerId={globalId} />
      </div>
    </main>
  );
};
export default CustomerPage;
