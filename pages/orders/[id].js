import React from "react";
import moment from "moment";
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
        res_no: metafield(key: "res_no", namespace: "Resale Number") {
          value
        }
        cus_no: metafield(key: "cus_no", namespace: "Customer Number") {
          value
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
  let lineItemArr = data.order.lineItems.edges;
  let notes = matafieldsArr.find(
    (o) => o.node.namespace === "Notes" && o.node.key === "notes"
  ).value;

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
            <div style={{ textAlign: "left" }}>
              <h1>{data.order.name.firstName}</h1>
              <h2 className="subtitle" style={{ fontSize: "16px" }}>
                <i>{moment(data.order.createdAt).format("MMMM DD, YYYY")}</i>
              </h2>
            </div>
            <div style={{ textAlign: "right" }} className="flex-right-column ">
              <h1 style={{ fontSize: "20px" }}>
                {formatter.format(data.order.totalPrice)}
              </h1>
              <h2 className="subtitle" style={{ fontSize: "16px" }}>
                <i>{data.order.currentSubtotalLineItemsQuantity} items</i>
              </h2>
            </div>
          </div>

          <div className="order-header">
            <div>
              <h2>Customer</h2>
              <p>
                {data.order.custoemr.firstName} {data.order.custoemr.lastName}
              </p>
              <p>{data.order.custoemr.defaultAddress.company} </p>
              <p>Customer #:{data.order.custoemr.cus_no}</p>
              <p>Resale #: {data.order.custoemr.res_no}</p>
              <p>
                Shopify ID:{" "}
                {data.order.custoemr.id.replace("gid://shopify/Customer/", "")}
              </p>
            </div>
            <div>
              <h2>Address</h2>
              <p>{data.order.shippingAddress.formatted}</p>
            </div>
            <div>
              <h2>Notes</h2>
              <p>{notes}</p>
            </div>
          </div>

          <div className="flex-top-btw">
            <div style={{ display: "table" }}>
              {data.order.customer.cus_no ? (
                <h3>{data.order.customer.cus_no.value}</h3>
              ) : (
                ""
              )}
              {data.order.customer.res_no ? (
                <h3>{data.order.customer.res_no.value}</h3>
              ) : (
                ""
              )}
              <h3>Shopify id: {id}</h3>{" "}
              <h3>Email: {data.order.customer.email}</h3>
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
