import React from "react";
import { useRouter } from "next/router";
import { useQuery } from "react-apollo";
import { gql } from "apollo-boost";

const GET_CUSTOMER = gql`
  query getCustomer($Id: ID!) {
    customer(id: $Id) {
      acceptsMarketing
    }
  }
`;

//customer(id: "gid://shopify/Customer/1310260789270")

const CustomerPage = () => {
  const { id } = useRouter().query;
  const { loading, error, data } = useQuery(GET_CUSTOMER, {
    variables: { Id: `gid://shopify/Customer/${id}` },
  });

  if (loading) return;
  if (error) return <p>{error.message}</p>;

  console.log(data ? data : "no data");

  return <main>test 900</main>;
};
export default CustomerPage;
