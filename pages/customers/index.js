import Link from "next/link";
import ButtonNav from "../../components/ButtonNav.js";

import CustomerList from "../../components/lists/CustomerList.js";

import { useQuery } from "react-apollo";
import { gql } from "apollo-boost";

const GET_CUSTOMENTS = gql`
  {
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

export default function SpecialPage({}) {
  const { loading, error, data } = useQuery(GET_CUSTOMENTS);

  let da = data ? JSON.stringify(data) : "no data";

  let list = loading
    ? "Loading..."
    : error
    ? `Error! ${error.message}`
    : data.customers.edges.map((cus) => (
        <CustomerList
          customer={{
            id: cus.node.id,
            name: `${cus.node.firstName} ${cus.node.lastName}`,
            email: cus.node.email,
            cusnumb: cus.node.metafield ? cus.node.metafield.cus_no : "none",
            orders: cus.node.ordersCount,
            age: cus.node.lifetimeDuration,
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
        <p>{da}</p>
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
