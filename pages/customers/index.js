import Link from "next/link";
import ButtonNav from "../../components/ButtonNav.js";

// import { gql, useQuery } from "react-apollo";

import CustomerList from "../../components/lists/CustomerList.js";

// import DataTable from "../../compo/nents/DataTable.js";
import { gql, useQuery } from "@apollo/client";

export default function SpecialPage({}) {
  const GET_DOGS = gql`
    {
      shop {
        name
      }
      customers(first: 10) {
        edges {
          node {
            id
            firstName
            lastName
            email
            metafield(key: "data", namespace: "customer_fields") {
              id
            }
            ordersCount
            lifetimeDuration
          }
        }
      }
    }
  `;
  const { loading, error, data } = useQuery(GET_DOGS);

  // let list = "test";
  let list = loading
    ? "Loading..."
    : error
    ? `Error! ${error.message}`
    : data.customers.edges.map((cus) => (
        <CustomerList
          customer={{
            id: cus.id,
            name: `${cus.firstName} ${cus.lastName}`,
            email: cus.email,
            cusnumb: cus.metafield ? cus.metafield.cus_no : "none",
            orders: cus.ordersCount,
            age: cus.lifetimeDuration,
          }}
        />
      ));

  return (
    <main>
      <ButtonNav />
      <section>
        <h1>Customers</h1>
        <p className="light">
          Search, sort and select a store customer from the list below to edit
          things like customer number, metafields and membership points.
        </p>
        <ul className="large-list customer-list">
          <li className="list-header">
            <p>Pic</p>
            <p style={{ marginLeft: "16px", justifySelf: "start" }}>Name</p>
            <p>Custoemr #</p>
            <p>Orders</p>
            <p>Age</p>
          </li>
          {list}
        </ul>
        <div className="flex-center-center">
          <button>Load more</button>
        </div>
      </section>
    </main>
  );
}
