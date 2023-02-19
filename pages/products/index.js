import { useState, useMemo, useEffect, useRef } from "react";
import { useQuery } from "react-apollo";
import { gql } from "apollo-boost";
import _ from "lodash";
// import debounce from "lodash.debounce";
import Link from "next/link";

import ButtonNav from "../../components/ButtonNav.js";
import Loader from "../../components/Loader.js";
import ProductList from "../../components/lists/ProductList.js";

const GET_CUSTOMENTS = gql`
  query getProducts(
    $first: Int = 50
    $after: String = null
    $srch: String!
    $srt: ProductSortKeys!
    $rev: Boolean!
  ) {
    products(
      first: $first
      after: $after
      query: $srch
      sortKey: $srt
      reverse: $rev
    ) {
      edges {
        node {
          featuredImage {
            src
            url
          }
          handle
          id
          onlineStoreUrl
          productType
          status
          title
          totalInventory
          vendor
          variants(first: 10) {
            edges {
              node {
                sku
                price
              }
            }
          }
        }
        cursor
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
      results.map((prod, i) => {
        let id = prod.node.id.replace("gid://shopify/Product/", "");

        return (
          <ProductList
            index={i}
            product={{
              id: id,
              gid: prod.node.id,
              title: prod.node.title,
              imgSrc: prod.node.featuredImage.url,
              variants: prod.node.variants ? prod.node.variants.edges : [],
              inventory: prod.node.totalInventory,
              price:
                prod.node.variants && prod.node.variants.edges.length
                  ? prod.node.variants.edges[0].node.price
                  : 0,
              status: prod.node.status,
              type: prod.node.productType,
              vendor: prod.node.vendor,
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
      setResults([...results, ...data.products.edges]);
      setLoadingMore(false);
    } else {
      console.log("resetting resutls");
      setResults(data.products.edges);
    }
  }, [data]);

  return (
    <main>
      <ButtonNav />
      <section>
        <h1>Products</h1>
        <p className="light">
          Search, sort and select a store product from the list below to view
          product information & variants as well as edit metafields.
        </p>
        <input
          onChange={debouncedChangeHandler}
          className="list-search"
          type="text"
          placeholder="Enter a product's name sku, or type..."
        />
        <ul className="large-list product-list">
          <li className="list-header">
            <p>Image</p>
            <p
              className={`flex-center-left sortable ${
                sort == "TITLE" ? "active-sort" : ""
              }`}
              onClick={() => {
                if (sort == "TITLE") {
                  setReverseSort(!reverseSort);
                }
                setSort("TITLE");
              }}
              style={{ justifySelf: "start" }}
            >
              <span>Title</span>
              {direction("A", "Z")}
            </p>
            <p>Info</p>
            <p>Type</p>
            <p>Vendor</p>
            <p>Status</p>
          </li>
          {list}
        </ul>
        <div className="flex-center-center">
          {results.length < 1 || searchTerm ? (
            ""
          ) : loading || error ? (
            <Loader />
          ) : data.products.pageInfo.hasNextPage ? (
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
