import React from "react";
import { useRouter } from "next/router";
import { useQuery } from "react-apollo";
import { gql } from "apollo-boost";

import Link from "next/link";
import ButtonNav from "../../components/ButtonNav.js";

const CustomerPage = () => {
  const { id } = useRouter().query;

  let page = "test";

  return (
    <main>
      <ButtonNav back="customers" />
      {page}
    </main>
  );
};
export default CustomerPage;
