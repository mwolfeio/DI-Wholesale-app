import React from "react";
import { useRouter } from "next/router";
import { useQuery } from "react-apollo";
import { gql } from "apollo-boost";

import Link from "next/link";
import ButtonNav from "../../components/ButtonNav.js";

const GET_CUSTOMER = gql`
  {
    customer(id: "gid://shopify/Customer/1310260789270") {
      id
    }
  }
`;

const CustomerPage = () => {
  const { id } = useRouter().query;
  // const { loading, error, data } = useQuery(GET_CUSTOMER);

  // let page = loading ? (
  //   <div
  //     style={{ height: "100%", width: "100%" }}
  //     className="flex-center-center"
  //   >
  //     <Loader />
  //   </div>
  // ) : error ? (
  //   `Error! ${error.message}`
  // ) : (
  //   <div style={{ width: "100%" }}>test</div>
  // );

  return (
    <main>
      <ButtonNav back="customers" />
    </main>
  );
};
export default CustomerPage;
