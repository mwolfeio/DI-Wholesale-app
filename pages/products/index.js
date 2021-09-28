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
          customerNumber: metafield(
            key: "cus_no"
            namespace: "Customer Number"
          ) {
            id
            value
          }
          custoemrNumberVarified: metafield(
            key: "cus_var"
            namespace: "CN Varified"
          ) {
            id
            value
          }
          ordersCount
          lifetimeDuration
          marketingOptInLevel
          defaultAddress {
            company
            address1
            address2
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
  const [results, setResults] = useState([]);
  const [lastCursor, setLastCursor] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
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
      results.map((cus, i) => {
        let id = cus.node.id.replace("gid://shopify/Customer/", "");
        let address1 = cus.node.defaultAddress
          ? `${cus.node.defaultAddress.address1} ${cus.node.defaultAddress.address2}, `
          : "";
        let address2 = cus.node.defaultAddress
          ? `${cus.node.defaultAddress.city}, ${cus.node.defaultAddress.provinceCode}`
          : "";
        let company = cus.node.defaultAddress
          ? cus.node.defaultAddress.company
          : "-";
        let cusNumb =
          cus.node.customerNumber && cus.node.customerNumber.value
            ? cus.node.customerNumber.value
            : "";
        let fieldId =
          cus.node.customerNumber && cus.node.customerNumber.id
            ? cus.node.customerNumber.id
            : "";

        let varified =
          cus.node.custoemrNumberVarified &&
          cus.node.custoemrNumberVarified.value
            ? cus.node.custoemrNumberVarified.value
            : false;

        console.log(
          "Index raw customerNumber: ",
          cus.node.customerNumber ? cus.node.customerNumber.value : "-"
        );
        console.log("Index cusNumb: ", cusNumb);

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
              address1: address1,
              address2: address2,
              company: company,
              totalSpent: cus.node.totalSpent,
              fieldId: fieldId,
              varified: cus.node.custoemrNumberVarified
                ? cus.node.custoemrNumberVarified
                : {},
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
      setResults([...results, ...data.customers.edges]);
      setLoadingMore(false);
    } else {
      console.log("resetting resutls");
      setResults(data.customers.edges);
    }
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
          placeholder="Enter customer's name, number, company or email..."
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
              style={{ justifySelf: "start" }}
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
              {direction("L", "H")}
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
          {results.length < 1 || searchTerm ? (
            ""
          ) : loading || error ? (
            <Loader />
          ) : data.customers.pageInfo.hasNextPage ? (
            <button onClick={loadMore}>Load more</button>
          ) : (
            ""
          )}
        </div>
      </section>
    </main>
  );
};
export default SpecialPage;
