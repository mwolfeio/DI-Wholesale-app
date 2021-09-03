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

var formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
const update = (val: any) => {
  var formatter = new Intl.NumberFormat("en-US"); // Intl language tag,
  updateValue(formatter.format(val.replace(/,/g, ""))); //Remove ',' to format number again
};

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

  let matafieldsArr = data.customer.metafields.edges;

  return (
    <main>
      <ButtonNav
        back="customers"
        cnumb={{
          display: true,
          cnumb: cusNumb,
          fields: matafieldsArr,
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
              <h3 stule>Shopify id: {id}</h3>
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
        <Orders address={data.customer.defaultAddress} />
        <MatafieldSection fields={matafieldsArr} />
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
