import { useState, useMemo, useEffect } from "react";
import { useQuery } from "react-apollo";
import { gql } from "apollo-boost";
import _ from "lodash";
// import debounce from "lodash.debounce";
import Link from "next/link";

import ButtonNav from "../../components/ButtonNav.js";
import Loader from "../../components/Loader.js";
import CustomerList from "../../components/lists/CustomerList.js";

const GET_CUSTOMENTS = gql`
  query getCustomers($first: Int = 4, $srch: String!, $srt: CustomerSortKeys!) {
    customers(first: $first, query: $srch, sortKey: $srt) {
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

const SpecialPage = ({}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const { loading, error, data } = useQuery(GET_CUSTOMENTS, {
    variables: { first: 22, srch: searchTerm, srt: "RELEVANCE" },
  });

  let list = loading ? (
    <Loader />
  ) : error ? (
    `Error! ${error.message}`
  ) : data.customers.edges.length ? (
    data.customers.edges.map((cus, i) => {
      console.log("cus.node: ", cus.node);
      console.log("cus.node.id: ", cus.node.id);

      let id = cus.node.id.replace("/customers/gid://shopify/Customer/", "");

      console.log("id: ", id);

      let cusNumb = cus.node.metafield
        ? JSON.parse(cus.node.metafield.value)
        : { cus_no: "No Metafields" };
      return (
        <CustomerList
          index={i}
          customer={{
            id: id,
            name: `${cus.node.firstName} ${cus.node.lastName}`,
            email: cus.node.email,
            cusnumb: cusNumb.cus_no,
            orders: cus.node.ordersCount,
            age: cus.node.lifetimeDuration,
          }}
        />
      );
    })
  ) : (
    <div
      className="flex-center-center"
      style={{ height: "58px", width: "100%" }}
    >
      <p>No Results</p>
    </div>
  );

  const pagnate = () => {
    console.log("load more");
  };
  const changeHandler = (event) => {
    setSearchTerm(event.target.value);
  };
  const debouncedChangeHandler = useMemo(
    () => _.debounce(changeHandler, 300),
    []
  );
  useEffect(() => {
    return () => {
      debouncedChangeHandler.cancel();
    };
  }, []);

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
          onChange={debouncedChangeHandler}
          className="list-search"
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
};
export default SpecialPage;
