import React from "react";
import { useRouter } from "next/router";
import { useQuery } from "react-apollo";
import { gql } from "apollo-boost";

const GET_CUSTOMER = gql`
  query MyQuery {
    customer(id: "gid://shopify/Customer/1310260789270") {
      acceptsMarketing
    }
  }
`;

const CustomerPage = () => {
  const { id } = useRouter().query;
  const { loading, error, data } = useQuery(GET_CUSTOMER);

  return <main>test 900</main>;
};
export default CustomerPage;
