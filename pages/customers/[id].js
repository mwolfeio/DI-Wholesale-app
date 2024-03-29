import React from "react";
import { useRouter } from "next/router";
import { useQuery } from "react-apollo";
import { gql } from "apollo-boost";

import Link from "next/link";
import ButtonNav from "../../components/ButtonNav.js";
import Loader from "../../components/Loader.js";
import MatafieldSection from "../../components/sections/Metafields.js";
import Orders from "../../components/sections/Orders.js";
import Discounts from "../../components/sections/Discounts.js";

const GET_CUSTOMER = gql`
  query getCustomer($id: ID!) {
    customer(id: $id) {
      defaultAddress {
        address1
        address2
        city
        company
        country
        zip
        provinceCode
        province
        phone
      }
      # acceptsMarketing
      createdAt
      addresses(first: 1) {
        address1
        city
        company
        country
        # countryCode
        # countryCodeV2
        phone
        provinceCode
        province
        zip
      }
      displayName
      email
      firstName
      # hasNote
      hasTimelineComment
      image {
        url
      }
      lastName
      lifetimeDuration
      # marketingOptInLevel
      metafields(first: 10) {
        edges {
          node {
            id
            key
            namespace
            value
            # type
          }
        }
      }
      note
      orders(first: 10) {
        edges {
          node {
            id
            name
            # totalPrice
            shippingAddress {
              address1
              address2
              city
              company
              # countryCode
              provinceCode
              zip
            }
            fulfillable
            metafield(key: "drop_ship", namespace: "Drop Shipping") {
              value
            }
            lineItems(first: 4) {
              edges {
                node {
                  # image(maxHeight: 500, maxWidth: 500) {
                  #   originalSrc
                  # }
                  image {
                    src
                    url(transform: { maxHeight: 500, maxWidth: 500 })
                  }
                  product {
                    id
                  }
                  # originalUnitPrice
                  originalUnitPriceSet {
                    shopMoney {
                      amount
                    }
                  }
                  # originalTotal
                  originalTotalSet {
                    shopMoney {
                      amount
                    }
                  }
                  quantity
                  sku
                  title
                  vendor
                }
              }
            }
            createdAt
          }
        }
      }
      phone
      # ordersCount
      tags
      taxExempt
      taxExemptions
      # totalSpent
      amountSpent {
        amount
      }
    }
  }
`;

var formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const CustomerPage = () => {
  const { id } = useRouter().query;
  let globalId = `gid://shopify/Customer/${id}`;

  const { loading, error, data } = useQuery(GET_CUSTOMER, {
    fetchPolicy: "no-cache",
    variables: { id: globalId },
  });

  if (loading) {
    return (
      <main>
        <ButtonNav back="customers" />
        <div
          style={{ height: "100%", width: "100%" }}
          className="flex-center-center"
        >
          <Loader />
        </div>
      </main>
    );
  }
  if (error) {
    return (
      <main>
        <ButtonNav back="customers" />
        <div
          style={{ height: "100%", width: "100%" }}
          className="flex-center-center"
        >
          {error.message}
        </div>
      </main>
    );
  }

  console.log(data);

  let matafieldsArr = data.customer.metafields.edges;
  let ordersArr = data.customer.orders.edges;
  let customerNumberObj = matafieldsArr.find(
    (o) => o.node.namespace === "Customer Number" && o.node.key === "cus_no"
  );
  let resaleNumberObj = matafieldsArr.find(
    (o) => o.node.namespace === "Resale Number" && o.node.key === "res_no"
  );
  let varifiedObj = matafieldsArr.find(
    (o) => o.node.namespace === "CN Varified" && o.node.key === "cus_var"
  );
  let cusNumb = customerNumberObj ? customerNumberObj.node.value : "";
  // let varifiedCn = varifiedObj ? varifiedObj.node.value : false;

  return (
    <main>
      <ButtonNav
        back="customers"
        cnumb={{
          display: true,
          cnumbObj: customerNumberObj ? customerNumberObj.node : {},
          globalId: globalId,
          varifiedObj: varifiedObj ? varifiedObj.node : {},
        }}
      />
      <div style={{ width: "100%" }}>
        <section className="clear">
          <div className="flex-bottom-btw underline">
            <div style={{ textAlign: "left" }}>
              <h1>
                {data.customer.firstName} {data.customer.lastName}
              </h1>
              <h2 className="subtitle" style={{ fontSize: "16px" }}>
                <i>{data.customer.defaultAddress.company}</i>
              </h2>
            </div>
            <div style={{ textAlign: "right" }} className="flex-right-column ">
              <h1 style={{ fontSize: "20px" }}>
                {formatter.format(data.customer.amountSpent?.amount ?? 0)} spent
              </h1>
              <h2 className="subtitle" style={{ fontSize: "16px" }}>
                <i>N/A Orders</i>
              </h2>
            </div>
          </div>
          <div className="flex-top-btw">
            <div style={{ display: "table" }}>
              <h3>Email: {data.customer.email}</h3>
              <h3>
                Phone:{" "}
                {data.customer.phone
                  ? data.customer.phone
                  : data.customer.defaultAddress.phone}
              </h3>
              {resaleNumberObj ? (
                <h3 stule>Resale Number: {resaleNumberObj.node.value}</h3>
              ) : (
                ""
              )}
              <h3 stule>Shopify id: {id.replace("$", "")}</h3>
            </div>
            <div style={{ textAlign: "right" }}>
              <h3 style={{ textAlign: "right" }}>
                Billing Address:
                <br />
                {data.customer.defaultAddress.company}
                <br />
                {data.customer.defaultAddress.address1}
                <br />
                {data.customer.defaultAddress.address2}
                {data.customer.defaultAddress.address2 && <br />}
                {data.customer.defaultAddress.city},{" "}
                {data.customer.defaultAddress.provinceCode}
                <br />
                {data.customer.defaultAddress.zip},{" "}
                {data.customer.defaultAddress.country}
              </h3>
            </div>
          </div>
        </section>
        <Discounts
          name={`${data.customer.firstName} ${data.customer.lastName}`}
          customerId={globalId}
          tags={data.customer.tags ? data.customer.tags : []}
        />
        <Orders fields={ordersArr} />
        <MatafieldSection
          fields={matafieldsArr}
          type="customer"
          globalId={globalId}
        />
      </div>
    </main>
  );
};
export default CustomerPage;

// <section className="disabled">Wishlist</section>
// <section className="disabled">Interests</section>
// <section className="disabled">Reviews</section>
// <section className="disabled">Alerts</section>
// <section className="disabled">Rewards</section>

// /<h3>Jained {data.customer.lifetimeDuration} ago</h3>
