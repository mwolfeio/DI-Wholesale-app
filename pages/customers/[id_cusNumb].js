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
          }
        }
      }
      note
      orders(first: 10) {
        edges {
          node {
            id
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

//customer(id: "gid://shopify/Customer/1310260789270")

const CustomerPage = () => {
  const { id_cusNumb } = useRouter().query;

  let hasCusNumb = id_cusNumb && id_cusNumb.includes("-");
  let id = hasCusNumb ? id_cusNumb.split("-")[0] : id_cusNumb;
  let cusNumb = hasCusNumb ? id_cusNumb.split("-")[1] : "";

  console.log("Id_CusNumb: ", id_cusNumb);
  console.log("id: ", id);
  console.log("cusNumb: ", cusNumb);

  let globalId = `gid://shopify/Customer/${id}`;

  const { loading, error, data } = useQuery(GET_CUSTOMER, {
    variables: { id: globalId },
  });

  let page = loading ? (
    <div
      style={{ height: "100%", width: "100%" }}
      className="flex-center-center"
    >
      <Loader />
    </div>
  ) : error ? (
    `Error! ${error.message}`
  ) : (
    <div style={{ width: "100%" }}>
      <section className="clear">
        <div className="flex-bottom-btw underline">
          <h1 className>
            {data.customer.firstName} {data.customer.lastName}
          </h1>
          <h1 style={{ fontSize: "20px" }}>
            ${data.customer.totalSpent} spent
          </h1>
        </div>
        <div className="flex-top-btw">
          <div style={{ display: "table" }}>
            <h3 stule>Shopify id: {id}</h3>
            <h3 stule>Email: {data.customer.email}</h3>
            <h3>
              Phone:{" "}
              {data.customer.phone
                ? data.customer.phone
                : data.customer.defaultAddress.phone}
            </h3>
          </div>
          <div>
            <h3 style={{ textAlign: right }}>
              {data.customer.ordersCount} Orders
            </h3>
            <h3 style={{ textAlign: right }}>
              Account created <br />
              {data.customer.lifetimeDuration}
            </h3>
          </div>
        </div>
      </section>
      <Orders address={data.customer.defaultAddress} />
      <MatafieldSection fields={data.customer.metafields} />
      <section className="disabled">Wishlist</section>
      <section className="disabled">Interests</section>
      <section className="disabled">Reviews</section>
      <section className="disabled">Alerts</section>
      <section className="disabled">Rewards</section>
    </div>
  );

  if (data) console.log(data);
  return (
    <main>
      <ButtonNav back="customers" cnumb={{ display: true, cnumb: cusNumb }} />
      {page}
    </main>
  );
};
export default CustomerPage;

// <span className="flex-center-left cus-numb-edit">
//   <h3>Customer #: {"00"}}</h3>
//   <svg
//     width="24"
//     height="24"
//     viewBox="0 0 24 24"
//     fill="none"
//     xmlns="http://www.w3.org/2000/svg"
//   >
//     <path
//       d="M20.4745 8.33237C21.0488 8.90667 21.0617 9.83374 20.5036 10.4238L10.9438 20.5307C10.6605 20.8303 10.2664 21 9.85405 21L5.49995 21C4.67153 21 3.99995 20.3284 3.99995 19.5L3.99995 15.1074C3.99995 14.7178 4.15155 14.3435 4.42266 14.0637L14.0817 4.09442C14.6646 3.49279 15.6273 3.48519 16.2196 4.07753L20.4745 8.33237Z"
//       fill="#b0b7c3"
//     />
//   </svg>
// </span>
//
