import { useState, useMemo, useEffect, useRef } from "react";
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
    $first: Int = 50
    $after: String = null
    $srch: String!
    $srt: CustomerSortKeys!
    $rev: Boolean!
  ) {
    customers(
      first: $first
      after: $after
      query: $srch
      sortKey: $srt
      reverse: $rev
    ) {
      edges {
        cursor
        node {
          id
          firstName
          lastName
          email
          metafield(key: "cus_no", namespace: "Customer Number") {
            value
            id
          }
          ordersCount
          lifetimeDuration
          marketingOptInLevel
          defaultAddress {
            company
            address1
            city
            provinceCode
            country
          }
          totalSpent
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

  const [results, setResults] = useState([]);
  const [lastCursor, setLastCursor] = useState(null);

  // const [pagnation, setPagnation] = useState(0);
  const [sort, setSort] = useState("RELEVANCE");
  const [reverseSort, setReverseSort] = useState(false);

  const { loading, error, data } = useQuery(GET_CUSTOMENTS, {
    fetchPolicy: "no-cache",
    variables: {
      srch: searchTerm,
      srt: sort,
      rev: reverseSort,
      after: lastCursor,
    },
  });

  const usePreviousc = (value) => {
    console.log("running usePreviousc");
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  };

  const loadMore = () => {
    let lastCursor = results.at(-1).cursor;
    console.log("setting new after to: ", lastCursor);
    setLastCursor(lastCursor);
    // setOffset(results.data.length);
  };

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
    loading && !results.length ? (
      <Loader />
    ) : error ? (
      `Error! ${error.message}`
    ) : results.length ? (
      results.map((cus, i) => {
        let id = cus.node.id.replace("gid://shopify/Customer/", "");
        let address = cus.node.defaultAddress
          ? `${cus.node.defaultAddress.city}, ${cus.node.defaultAddress.provinceCode}`
          : "";
        let company = cus.node.defaultAddress
          ? cus.node.defaultAddress.company
          : "-";
        let cusNumb =
          cus.node.metafield && cus.node.metafield.value
            ? cus.node.metafield.value
            : "";
        let fieldId =
          cus.node.metafield && cus.node.metafield.id
            ? cus.node.metafield.id
            : "";

        return (
          <CustomerList
            index={i}
            customer={{
              id: id,
              gid: cus.node.id,
              name: `${cus.node.lastName}, ${cus.node.firstName}`,
              email: cus.node.email,
              cusnumb: cusNumb,
              orders: cus.node.ordersCount,
              age: cus.node.lifetimeDuration,
              address: address,
              company: company,
              totalSpent: cus.node.totalSpent,
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
    console.log("updating results with: ", data);
    if (!data) return;
    const newResults = [];
    //if search, sort, and reverseSort did not chnage
    console.log(
      "sort changed: ",
      sort == usePrevious(sort),
      " new: ",
      sort,
      " old: ",
      usePrevious(sort)
    );
    console.log(
      "searchTerm changed: ",
      searchTerm == usePrevious(searchTerm),
      " new: ",
      searchTerm,
      " old: ",
      usePrevious(searchTerm)
    );
    console.log(
      "sort changed: ",
      reverseSort == usePrevious(reverseSort),
      " new: ",
      reverseSort,
      " old: ",
      usePrevious(reverseSort)
    );

    if (
      true
      // sort == usePrevious(sort) &&
      // searchTerm == usePrevious(searchTerm) &&
      // reverseSort == usePrevious(reverseSort)
    ) {
      const newResults = [...results, ...data.customers.edges];
    } else {
      //if they did chnage
      const newResults = data.customers.edges;
    }

    setResults(newResults);
    console.log("resuts updated");
  }, [data]);

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
        />
        <ul className="large-list customer-list">
          <li className="list-header">
            <p
              className={`sortable ${sort == "NAME" ? "active-sort" : ""}`}
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
          ) : data.customers.pageInfo.hasNextPage ? (
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

// <p
//   onClick={() => setSort("UPDATED_AT")}
//   className={`sortable ${sort == "RELEVANCE" ? "active-sort" : ""}`}
// >
//   Age
// </p>

// <CustomerList
//   index="1"
//   customer={{
//     id: "test",
//     gid: "test",
//     name: "test",
//     email: "test",
//     cusnumb: "test",
//     orders: "test",
//     age: "test",
//     address: "test",
//     company: "test",
//     totalSpent: "test",
//     fieldId: "test",
//   }}
// />
