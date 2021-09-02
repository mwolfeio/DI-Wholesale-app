import Link from "next/link";
import ButtonNav from "../../components/ButtonNav.js";

import CustomerList from "../../components/lists/CustomerList.js";

import { useQuery } from "react-apollo";
import { gql } from "apollo-boost";

const GET_CUSTOMENTS = gql`
  {
    customers(first: 10, query: "m") {
      edges {
        node {
          id
          firstName
          lastName
          email
          metafield(key: "data", namespace: "customer_fields") {
            value
          }
          ordersCount
          lifetimeDuration
          marketingOptInLevel
        }
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`;

export default function SpecialPage({}) {
  const { loading, error, data } = useQuery(GET_CUSTOMENTS);

  let list = loading
    ? "Loading..."
    : error
    ? `Error! ${error.message}`
    : data.customers.edges.map((cus) => {
        let cusNumb = cus.node.metafield
          ? JSON.parse(cus.node.metafield.value)
          : { cus_no: "No Metafields" };
        return (
          <CustomerList
            customer={{
              id: cus.node.id,
              name: `${cus.node.firstName} ${cus.node.lastName}`,
              email: cus.node.email,
              cusnumb: cusNumb.cus_no,
              orders: cus.node.ordersCount,
              age: cus.node.lifetimeDuration,
            }}
          />
        );
      });

  return (
    <main>
      <ButtonNav />
      <section>
        <h1>Customers</h1>
        <p className="light">
          Search, sort and select a store customer from the list below to edit
          things like customer number, metafields and membership points.
        </p>
        <input placeholder="Enter a customer's name..."></input>
        <ul className="large-list customer-list">
          <li className="list-header">
            <p>Pic</p>
            <p style={{ marginLeft: "16px", justifySelf: "start" }}>Name</p>
            <p>Customer #</p>
            <p>Orders</p>
            <p>Age</p>
          </li>
          {list}
        </ul>
        <div className="flex-center-center">
          {loading || error ? (
            ""
          ) : data.customers.pageInfo.hasNextPage ? (
            <button>Load more</button>
          ) : (
            ""
          )}
        </div>
      </section>
    </main>
  );
}
