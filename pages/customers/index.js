import Link from "next/link";
import ButtonNav from "../../components/ButtonNav.js";

import CustomerList from "../../components/lists/CustomerList.js";

import { useQuery } from "react-apollo";
import { gql } from "apollo-boost";

let test = "m";

const GET_CUSTOMENTS = gql`
  query getCustomers($first: Int = 4, $srch: String!) {
    customers(first: $first, query: $srch) {
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
  const { loading, error, data } = useQuery(GET_CUSTOMENTS, {
    variables: { first: 20, srch: "Holly" },
  });

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

  const pagnate = () => {
    console.log("load more");
  };
  const handleChange = (e) => {
    console.log("changed");
  };

  return (
    <main>
      <ButtonNav />
      <section>
        <h1>Customers</h1>
        <p className="light">
          Search, sort and select a store customer from the list below to edit
          things like customer number, metafields and membership points.
        </p>
        <input
          className="list-search"
          onChange={(e) => handleChange(e)}
          type="text"
          placeholder="Enter a customer's name..."
        ></input>
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
            <button onClick={pagnate}>Load more</button>
          ) : (
            ""
          )}
        </div>
      </section>
    </main>
  );
}
