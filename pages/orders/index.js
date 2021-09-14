import { useState, useMemo, useEffect, useRef } from "react";
import { useQuery } from "react-apollo";
import { gql } from "apollo-boost";
import _ from "lodash";
// import debounce from "lodash.debounce";
import Link from "next/link";

import ButtonNav from "../../components/ButtonNav.js";
import Loader from "../../components/Loader.js";
import OrderList from "../../components/lists/OrderList.js";

const GET_ORDERS = gql`
  query getCustomers(
    $first: Int = 50
    $after: String = null
    $srch: String!
    $srt: CustomerSortKeys!
    $rev: Boolean!
  ) {
    orders(
      first: $first
      after: $after
      query: $srch
      sortKey: $srt
      reverse: $rev
    ) {
      edges {
        cursor
        node {
          metafield(key: "cus_no", namespace: "Customer number") {
            id
            value
          }
          name
          totalPrice
          id
          fulfillable
          email
          displayAddress {
            company
            city
            country
            province
            provinceCode
          }
          customer {
            firstName
            email
            lastName
          }
        }
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`;

const SpecialPage = ({}) => {
  const [results, setResults] = useState([]);
  const [lastCursor, setLastCursor] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState("CREATED_AT");
  const [reverseSort, setReverseSort] = useState(false);

  const { loading, error, data } = useQuery(GET_ORDERS, {
    fetchPolicy: "no-cache",
    variables: {
      srch: searchTerm,
      srt: sort,
      rev: reverseSort,
      after: lastCursor,
    },
  });

  const loadMore = () => {
    let lastCursor = results.at(-1).cursor;
    console.log("setting new after to: ", lastCursor);
    setLoadingMore(true);
    setLastCursor(lastCursor);
  };
  console.log("data: ", data);
  let direction = (a, b) => {
    return (
      <span
        style={{ marginLeft: "4px", opacity: 0.5 }}
        className="flex-center-center"
      >
        ({!reverseSort ? a : b}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          fill="none"
          viewBox="0 0 24 24"
          style={{ transform: `rotate(-90deg)` }}
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M12 6.5v11m0 0l4-4.588M12 17.5l-4-4.588"
          ></path>
        </svg>
        {!reverseSort ? b : a})
      </span>
    );
  };
  let list =
    loading && !loadingMore ? (
      <Loader />
    ) : error ? (
      `Error! ${error.message}`
    ) : results.length ? (
      results.map((ord, i) => {
        let id = ord.node.id.replace("gid://shopify/Order/", "");
        let address = ord.node.displayAddress
          ? `${ord.node.displayAddress.city}, ${ord.node.displayAddress.provinceCode}`
          : "";
        let company = ord.node.displayAddress
          ? ord.node.displayAddress.company
          : "-";
        let cusNumb =
          ord.node.metafield && ord.node.metafield.value
            ? ord.node.metafield.value
            : "";
        let fieldId =
          ord.node.metafield && ord.node.metafield.id
            ? ord.node.metafield.id
            : "";

        return (
          <OrderList
            index={i}
            customer={{
              id: id,
              gid: ord.node.id,
              number: ord.node.name,
              name: `${ord.node.customer.lastName}, ${ord.node.customer.firstName}`,
              email: ord.node.email,
              cusnumb: cusNumb,
              orders: 0,
              age: 0,
              address: address,
              company: company,
              totalSpent: ord.node.totalPrice,
              fieldId: fieldId,
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
  useEffect(() => {
    console.log("loading more: ", loadingMore);
    if (loading || !data) return;
    if (loadingMore) {
      console.log("loading more to resutls");
      setResults([...results, ...data.orders.edges]);
      setLoadingMore(false);
    } else {
      console.log("resetting resutls");
      setResults(data.orders.edges);
    }
  }, [data]);

  return (
    <main>
      <ButtonNav />
      <section>
        <h1>Orders</h1>
        <p className="light">
          Search, sort and select an order from the list below to edit things
          like customer number, metafields and membership points.
        </p>
        <input
          onChange={debouncedChangeHandler}
          className="list-search"
          type="text"
          placeholder="Enter an order or customer..."
        />
        <ul className="large-list customer-list">
          <li className="list-header">
            <p
              className={`flex-center-left sortable ${
                sort == "NAME" ? "active-sort" : ""
              }`}
              onClick={() => {
                if (sort == "NAME") {
                  setReverseSort(!reverseSort);
                }
                setSort("NAME");
              }}
              style={{ marginLeft: "16px", justifySelf: "start" }}
            >
              <span>Name</span>
              {direction("A", "Z")}
            </p>

            <p style={{ justifySelf: "start" }}>Company</p>
            <p>CN</p>
            <p
              onClick={() => {
                if (sort == "ORDERS_COUNT") {
                  setReverseSort(!reverseSort);
                }
                setSort("ORDERS_COUNT");
              }}
              className={`sortable ${
                sort == "ORDERS_COUNT" ? "active-sort" : ""
              }`}
            >
              <span>Orders</span>
              {direction("H", "L")}
            </p>
            <p
              onClick={() => {
                if (sort == "RELEVANCE") {
                  setReverseSort(!reverseSort);
                }
                setSort("RELEVANCE");
              }}
              style={{ justifySelf: "flex-end" }}
              className={`flex-center-right sortable ${
                sort == "RELEVANCE" ? "active-sort" : ""
              }`}
            >
              <span>Age</span>
              {direction("N", "O")}
            </p>
          </li>
          {list}
        </ul>
        <div className="flex-center-center">
          {loading || error ? (
            ""
          ) : data.orders.pageInfo.hasNextPage ? (
            <button onClick={loadMore}>
              {loading ? <Loader size="24" /> : "Load more"}
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
