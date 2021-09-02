import React from "react";
import { useRouter } from "next/router";
import { useQuery } from "react-apollo";
import { gql } from "apollo-boost";

import Link from "next/link";
import ButtonNav from "../../components/ButtonNav.js";

const GET_CUSTOMER = gql`
  query getCustomer($Id: ID!) {
    customer(id: $Id) {
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

const CustomerPage = () => {
  const { id } = useRouter().query;
  const { loading, error, data } = useQuery(GET_CUSTOMER, {
    variables: { Id: `gid://shopify/Customer/${id}` },
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
    <div style={{ width: "100%" }}>test</div>
  );

  return (
    <main>
      <ButtonNav back="customers" />
      {page}
    </main>
  );
};
export default CustomerPage;
