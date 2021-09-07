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
  query getCustomers(
    $first: Int = 30
    $after: String = null
    $srch: String!
    $srt: CustomerSortKeys!
  ) {
    customers(first: $first, after: $after, query: $srch, sortKey: $srt) {
      edges {
        cursor
        node {
          id
          firstName
          lastName
          email
          metafield(key: "Number", namespace: "Customer") {
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
  // const [results, setResults] = useState([]);
  const [pagnation, setPagnation] = useState(0);
  const [sort, setSort] = useState("RELEVANCE");

  const { loading, error, data, fetchMore } = useQuery(GET_CUSTOMENTS, {
    fetchPolicy: "no-cache",
    variables: { srch: searchTerm, srt: sort },
  });

  let list = loading ? (
    <Loader />
  ) : error ? (
    `Error! ${error.message}`
  ) : data.customers.edges.length ? (
    data.customers.edges.map((cus, i) => {
      let id = cus.node.id.replace("gid://shopify/Customer/", "");
      let cusNumb =
        cus.node.metafield && cus.node.metafield.value
          ? cus.node.metafield.value
          : "";

      return (
        <CustomerList
          index={i}
          customer={{
            id: id,
            name: `${cus.node.firstName} ${cus.node.lastName}`,
            email: cus.node.email,
            cusnumb: cusNumb,
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

  // const pagnate = () => {
  //   let after = data.customers.edges.length - 1;
  //   console.log("loading everything after ", after);
  //   fetchMore({
  //     variables: {
  //       srch: searchTerm,
  //       srt: sort,
  //       after: after,
  //     },
  //   });
  //   console.log("error: ", error);
  // };
  const changeHandler = (event) => {
    setSearchTerm(event.target.value);
    setSort("RELEVANCE");
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
            <p
              className={`sortable ${sort == "NAME" ? "active-sort" : ""}`}
              onClick={() => setSort("NAME")}
              style={{ marginLeft: "16px", justifySelf: "start" }}
            >
              Name
            </p>
            <p>Customer #</p>
            <p
              onClick={() => setSort("ORDERS_COUNT")}
              className={`sortable ${
                sort == "ORDERS_COUNT" ? "active-sort" : ""
              }`}
            >
              Orders
            </p>
            <p
              onClick={() => setSort("UPDATED_AT")}
              className={`sortable ${
                sort == "UPDATED_AT" ? "active-sort" : ""
              }`}
            >
              Age
            </p>
          </li>
          {list}
        </ul>
        <div className="flex-center-center">
          {loading || error ? (
            ""
          ) : data.customers.pageInfo.hasNextPage ? (
            <button
              onClick={() =>
                fetchMore({
                  variables: {
                    srch: searchTerm,
                    srt: sort,
                    after: data.customers.edges
                      ? data.customers.edges.length - 1
                      : null,
                  },
                })
              }
            >
              Load more
            </button>
          ) : (
            ""
          )}
        </div>
      </section>
    </main>
  );
};
export default SpecialPage;
