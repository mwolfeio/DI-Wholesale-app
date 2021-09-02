import React from "react";
import { useRouter } from "next/router";
import { useQuery } from "react-apollo";
import { gql } from "apollo-boost";

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
  const { id } = useRouter().query;
  let globalId = `gid://shopify/Customer/${id}`;
  console.log(id);
  console.log(globalId);
  const { loading, error, data } = useQuery(GET_CUSTOMER, {
    variables: { id: globalId },
  });

  if (loading) return;
  if (error) return <p>{error.message}</p>;

  console.log(data ? data : "no data");

  return <main>test 900</main>;
};
export default CustomerPage;
