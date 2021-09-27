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
import AddressCard from "../../components/orderCards/AddressCard.js";
import LineItems from "../../components/sections/LineItems.js";

const GET_ORDER = gql`
  query getOrder($id: ID!) {
    order(id: $id) {
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
        cus_var: metafield(key: "cus_var", namespace: "CN Varified") {
          value
        }
        ordersCount
        totalSpent
      }
      displayFulfillmentStatus
      email
      fulfillable
      name
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
            product {
              id
              onlineStoreUrl
            }
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
        address1
        address2
        city
        company
        country
        name
        phone
        provinceCode
        zip
      }
      billingAddress {
        address1
        address2
        city
        company
        country
        name
        phone
        provinceCode
        zip
      }
      totalPrice
      fullyPaid
    }
  }
`;

var formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const CustomerPage = () => {
  const { id } = useRouter().query;
  console.log(id);
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
  let currentDate = new Date();
  let matafieldsArr = data.order.metafields.edges;
  let lineItemArr = data.order.lineItems.edges;
  let notes = matafieldsArr.find((o) => o.node.key === "notes");
  let rawDropShip = matafieldsArr.find((o) => o.node.key === "drop_ship");
  let isDropShipping =
    rawDropShip && rawDropShip.value === "true" ? true : false;
  let rawShipDate = matafieldsArr.find((o) => o.node.key === "ship_date");
  let shiptDateStr = !rawShipDate
    ? null
    : rawShipDate.node.value.indexOf("-") > -1
    ? rawShipDate.node.value.replace("-", "/")
    : `${rawShipDate.node.value.substring(
        0,
        4
      )}/${rawShipDate.node.value.substring(
        4,
        6
      )}/${rawShipDate.node.value.substring(6, 8)}`;
  let shiptDate = new Date(shiptDateStr);
  let isLate = rawShipDate && currentDate > shiptDate && data.order.fulfillable;

  console.log("currentDate: ", currentDate);
  console.log("shiptDate: ", shiptDate);
  console.log("is late: ", isLate);

  // let resaleNumberObj = matafieldsArr.find(
  //   (o) => o.node.namespace === "Resale Number" && o.node.key === "res_no"
  // );
  // let cusNumb = customerNumberObj ? customerNumberObj.node.value : "";

  let tag = (
    <h1 style={{ marginBottom: 0, color: isDropShipping ? "#4388f8" : "" }}>
      {isDropShipping ? "Drop Shipping" : "Wholesale Order"}
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
              <div className="flex-center-left">
                <h1>{data.order.name}</h1>

                <div
                  style={{ marginLeft: "8px" }}
                  className={`tinny-tag flex-center-center ${
                    !data.order.fulfillable
                      ? "dissabled-tiny-tab"
                      : isLate
                      ? "late-date"
                      : "warning-tiny-tab"
                  }`}
                >
                  {data.order.fulfillable ? "Unfulfilled" : "Fulfilled"}
                </div>
              </div>
              <h2
                className={`subtitle ${isLate ? "late-date" : ""}`}
                style={{ fontSize: "16px" }}
              >
                <i>
                  Created:{" "}
                  {`${moment(data.order.createdAt).format("MMM DD, YYYY")} ${
                    rawShipDate ? "-> Ships: " : ""
                  } ${
                    rawShipDate ? moment(shiptDate).format("MMM DD, YYYY") : ""
                  }`}
                </i>
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

          <div className="order-page-header">
            <Link
              href={`/customers/${data.order.customer.id.replace(
                "gid://shopify/Customer/",
                ""
              )}`}
            >
              <div className="clickable-card">
                <div className=" flex-center-btw">
                  <h2>Customer</h2>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      opacity="0.3"
                      x="15.8892"
                      y="7.19678"
                      width="2"
                      height="14"
                      rx="1"
                      transform="rotate(45 15.8892 7.19678)"
                      fill="currentColor"
                    />
                    <path
                      d="M8.11084 8.90381C7.55856 8.90381 7.11084 8.45609 7.11084 7.90381C7.11084 7.35152 7.55856 6.90381 8.11084 6.90381L16.5961 6.90381C17.1315 6.90381 17.5719 7.32549 17.5952 7.86037L17.9487 15.9921C17.9727 16.5439 17.5449 17.0106 16.9931 17.0346C16.4413 17.0586 15.9746 16.6307 15.9506 16.079L15.6387 8.90381H8.11084Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>

                <p
                  className="order-page-customer-card-titile"
                  style={{ display: "block" }}
                >
                  {data.order.customer.firstName} {data.order.customer.lastName}
                  <br />
                  <i style={{ display: "block", margin: "-6px 0 4px" }}>
                    {data.order.customer.defaultAddress.company}
                  </i>
                </p>

                <p
                  className="subtitle"
                  style={{ margin: "0 0 -6px", fontSize: "12px" }}
                >
                  Customer #
                </p>
                <div>
                  <p>
                    {data.order.customer.cus_no
                      ? data.order.customer.cus_no.value
                      : "-"}
                  </p>

                  {data.order.customer.cus_var &&
                  data.order.customer.cus_var.value ? (
                    ""
                  ) : (
                    <div
                      style={{ marginLeft: "8px" }}
                      className="error-tab tinny-tag flex-center-center"
                    >
                      Unverified
                    </div>
                  )}
                </div>
                <p
                  className="subtitle"
                  style={{ margin: "0 0 -6px", fontSize: "12px" }}
                >
                  Resale #
                </p>

                <p>
                  {data.order.customer.res_no
                    ? data.order.customer.res_no.value
                    : "-"}
                </p>
                <p
                  className="subtitle"
                  style={{ margin: "0 0 -6px", fontSize: "12px" }}
                >
                  Shopify ID
                </p>
                <p>
                  {data.order.customer.id.replace(
                    "gid://shopify/Customer/",
                    ""
                  )}
                </p>
              </div>
            </Link>
            <AddressCard
              shipping={data.order.shippingAddress}
              billing={data.order.billingAddress}
            />
            <div>
              <h2>Notes</h2>
              <p>{notes ? notes.node.value : "no notes"}</p>
            </div>
          </div>
          <LineItems items={lineItemArr} />
        </section>

        <MatafieldSection fields={matafieldsArr} customerId={globalId} />
      </div>
    </main>
  );
};
export default CustomerPage;

// <div
//   style={{ marginLeft: "16px" }}
//   className={`tinny-tag flex-center-center ${
//     !data.order.fullyPaid
//       ? "warning-tiny-tab"
//       : "dissabled-tiny-tab"
//   }`}
// >
//   {!data.order.fullyPaid ? "Unpaid" : "Paid"}
// </div>

// <div className="flex-top-btw">
//   <div style={{ display: "table" }}>
//     {data.order.customer.cus_no ? (
//       <h3>{data.order.customer.cus_no.value}</h3>
//     ) : (
//       ""
//     )}
//     {data.order.customer.res_no ? (
//       <h3>{data.order.customer.res_no.value}</h3>
//     ) : (
//       ""
//     )}
//     <h3>Shopify id: {id}</h3>{" "}
//     <h3>Email: {data.order.customer.email}</h3>
//     <h3>
//       Phone:{" "}
//       {data.order.customer.phone
//         ? data.order.customer.phone
//         : data.order.customer.defaultAddress.phone}
//     </h3>
//   </div>
//   <div style={{ textAlign: "right" }}>
//     <h3 style={{ textAlign: "right" }}>
//       {data.order.customer.ordersCount} Orders <br />
//       <br />
//       {data.order.customer.totalSpent} spent
//     </h3>
//   </div>
// </div>
