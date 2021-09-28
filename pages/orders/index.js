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
    $srt: OrderSortKeys!
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
          metafield_0: metafield(key: "drop_ship", namespace: "Drop Shipping") {
            id
            value
          }
          metafield_1: metafield(key: "ship_date", namespace: "Ship Date") {
            id
            value
          }
          name
          totalPrice
          id
          currentSubtotalLineItemsQuantity
          fulfillable
          email
          createdAt
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
            id
            cus_no: metafield(namespace: "Customer Number", key: "cus_no") {
              id
              value
            }
            cus_var: metafield(namespace: "CN Varified", key: "cus_var") {
              id
              value
            }
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
  const [sort, setSort] = useState("ORDER_NUMBER");
  const [reverseSort, setReverseSort] = useState(true);

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
        let shiptDate =
          ord.node.metafield_1 == null || ord.node.metafield_1.value == "-"
            ? null
            : ord.node.metafield_1.value.indexOf("-") > -1
            ? ord.node.metafield_1.value.replace("-", "/")
            : `${ord.node.metafield_1.value.substring(
                0,
                4
              )}/${ord.node.metafield_1.value.substring(
                4,
                6
              )}/${ord.node.metafield_1.value.substring(6, 8)}`;

        let dropShip =
          ord.node.metafield_0 && ord.node.metafield_0.value === "true"
            ? true
            : false;
        let fieldId =
          ord.node.metafield && ord.node.metafield.id
            ? ord.node.metafield.id
            : "";

        return (
          <OrderList
            index={i}
            order={{
              id: id,
              gid: ord.node.id,
              number: ord.node.name,
              customerId: ord.node.customer.id,
              customerNumber: ord.node.customer.cus_no
                ? ord.node.customer.cus_no
                : {},
              customerNumberVarified: ord.node.customer.cus_var
                ? ord.node.customer.cus_var
                : {},
              name: `${ord.node.customer.lastName}, ${ord.node.customer.firstName}`,
              email: ord.node.email,
              dropShip: dropShip,
              shiptDate: shiptDate,
              orders: ord.node.currentSubtotalLineItemsQuantity,
              address: address,
              company: company,
              totalSpent: ord.node.totalPrice,
              fieldId: fieldId,
              fulfillable: ord.node.fulfillable,
              createdAt: ord.node.createdAt,
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
          placeholder="Enter order or customer number, company, etc..."
        />
        <ul className="large-list order-list">
          <li className="list-header">
            <p
              className={`flex-center-left sortable ${
                sort == "ORDER_NUMBER" ? "active-sort" : ""
              }`}
              onClick={() => {
                if (sort == "ORDER_NUMBER") {
                  setReverseSort(!reverseSort);
                }
                setSort("ORDER_NUMBER");
              }}
              style={{ justifySelf: "start" }}
            >
              <span>Order</span>
              {direction("0", "1")}
            </p>
            <p
              className={` sortable ${
                sort == "CREATED_AT" ? "active-sort" : ""
              }`}
              onClick={() => {
                if (sort == "CREATED_AT") {
                  setReverseSort(!reverseSort);
                }
                setSort("CREATED_AT");
              }}
              style={{ justifySelf: "start" }}
            >
              <span>Date</span>
              {direction("O", "N")}
            </p>
            <p style={{ justifySelf: "start" }}>Ship Date</p>
            <p
              onClick={() => {
                if (sort == "CUSTOMER_NAME") {
                  setReverseSort(!reverseSort);
                }
                setSort("CUSTOMER_NAME");
              }}
              className={`sortable ${
                sort == "CUSTOMER_NAME" ? "active-sort" : ""
              }`}
              style={{ justifySelf: "start" }}
            >
              <span>Customer</span>
              {direction("A", "Z")}
            </p>
            <p>CN</p>
            <p>items</p>
            <p>Status</p>
          </li>
          {list}
        </ul>
        <div className="flex-center-center">
          {results.length < 1 && !searchTerm ? (
            ""
          ) : loading || error ? (
            <Loader />
          ) : data.orders.pageInfo.hasNextPage ? (
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

// {(loading || error) && results.length < 1 ?  <Loader /> (
//   ""
// ) : data.orders.pageInfo.hasNextPage ? (
//   <button onClick={loadMore}>
//     {loading ? <Loader size="24" /> : "Load more"}
//   </button>
// ) : (
//   ""
// )

// <p
//   onClick={() => {
//     if (sort == "FULFILLMENT_STATUS") {
//       setReverseSort(!reverseSort);
//     }
//     setSort("FULFILLMENT_STATUS");
//   }}
//   style={{ justifySelf: "flex-end" }}
//   className={`flex-center-right sortable ${
//     sort == "FULFILLMENT_STATUS" ? "active-sort" : ""
//   }`}
// >
//   <span>Status </span>
//   {direction("T", "F")}
// </p>
