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

var formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const CustomerPage = () => {
  const { id } = useRouter().query;
  let globalId = `gid://shopify/Customer/${id}`;

  let data = {
    customer: {
      defaultAddress: {
        address1: "16 Depot Square #60",
        address2: "",
        city: "Peterborough",
        company: "Bowerbird & Friends",
        country: "United States",
        zip: "03458",
        provinceCode: "NH",
        province: "New Hampshire",
        phone: "+1 603-924-2550",
        __typename: "MailingAddress",
      },
      acceptsMarketing: true,
      createdAt: "2021-06-16T10:51:25Z",
      addresses: [
        {
          address1: "16 Depot Square #60",
          city: "Peterborough",
          company: "Bowerbird & Friends",
          country: "United States",
          countryCode: "US",
          countryCodeV2: "US",
          phone: "+1 603-924-2550",
          provinceCode: "NH",
          province: "New Hampshire",
          zip: "03458",
          __typename: "MailingAddress",
        },
      ],
      displayName: "Katherine Forrest",
      email: "bowerbirdandfriends@yahoo.com",
      firstName: "Katherine",
      hasNote: false,
      hasTimelineComment: false,
      image: {
        src: "https://cdn.shopify.com/proxy/9c36f3827d6a4932cd573a68dff10eb959d527379804822084562afbb24b8f12/www.gravatar.com/avatar/60caa359498acd04f7cc699693bce739.jpg?s=2048&d=https%3A%2F%2Fcdn.shopify.com%2Fshopifycloud%2Fshopify%2Fassets%2Fadmin%2Fcustomers%2Fpolaris%2Favatar-1-b76694110b51e84b3b1f58a87c230122828e20a2d916fffeb403496db8e3f04f.png",
        __typename: "Image",
      },
      lastName: "Forrest",
      lifetimeDuration: "3 months",
      marketingOptInLevel: "SINGLE_OPT_IN",
      metafields: {
        edges: [
          {
            node: {
              id: "gid://shopify/Metafield/19407908012211",
              key: "access_token",
              namespace: "customer_fields",
              value: "95d6468885733eec3b173a85b00b7c94",
              type: "string",
              __typename: "Metafield",
            },
            __typename: "MetafieldEdge",
          },
          {
            node: {
              id: "gid://shopify/Metafield/19407908044979",
              key: "data",
              namespace: "customer_fields",
              value:
                '{"existing_cus":"Yes","resale":"38-3912838","cus_no":"42370","wholesale_legal":true,"address_type":"biztyp_Corporate"}',
              type: "JSON_STRING",
              __typename: "Metafield",
            },
            __typename: "MetafieldEdge",
          },
          {
            node: {
              id: "gid://shopify/Metafield/19978903814323",
              key: "res_no",
              namespace: "Resale Number",
              value: "38-3912838",
              type: "string",
              __typename: "Metafield",
            },
            __typename: "MetafieldEdge",
          },
          {
            node: {
              id: "gid://shopify/Metafield/19978903847091",
              key: "cus_no",
              namespace: "Customer Number",
              value: "42370",
              type: "string",
              __typename: "Metafield",
            },
            __typename: "MetafieldEdge",
          },
        ],
        __typename: "MetafieldConnection",
      },
      note: null,
      orders: {
        edges: [
          {
            node: {
              id: "gid://shopify/Order/3987836633267",
              name: "WH1406",
              totalPrice: "1583.50",
              shippingAddress: {
                address1: "16 Depot Square #60",
                address2: "",
                city: "Peterborough",
                company: "Bowerbird & Friends",
                countryCode: "US",
                provinceCode: "NH",
                zip: "03458",
                __typename: "MailingAddress",
              },
              fulfillable: true,
              metafield: {
                value: "FALSE",
                __typename: "Metafield",
              },
              lineItems: {
                edges: [
                  {
                    node: {
                      image: {
                        originalSrc:
                          "https://cdn.shopify.com/s/files/1/0532/6018/9875/products/8822367_101_500x500.jpg?v=1611449009",
                        __typename: "Image",
                      },
                      product: {
                        id: "gid://shopify/Product/6195781894323",
                        priceRange: {
                          maxVariantPrice: {
                            amount: "125.0",
                            __typename: "MoneyV2",
                          },
                          __typename: "ProductPriceRange",
                        },
                        __typename: "Product",
                      },
                      originalTotal: "30.00",
                      quantity: 24,
                      sku: "8822367",
                      title: "Nordic™ ornament (finial)",
                      vendor: "texxture",
                      __typename: "LineItem",
                    },
                    __typename: "LineItemEdge",
                  },
                  {
                    node: {
                      image: {
                        originalSrc:
                          "https://cdn.shopify.com/s/files/1/0532/6018/9875/products/8821666_101_500x500.jpg?v=1611449016",
                        __typename: "Image",
                      },
                      product: {
                        id: "gid://shopify/Product/6195776553139",
                        priceRange: {
                          maxVariantPrice: {
                            amount: "125.0",
                            __typename: "MoneyV2",
                          },
                          __typename: "ProductPriceRange",
                        },
                        __typename: "Product",
                      },
                      originalTotal: "30.00",
                      quantity: 24,
                      sku: "8821666",
                      title: "Nordic™ ornament (sleigh)",
                      vendor: "texxture",
                      __typename: "LineItem",
                    },
                    __typename: "LineItemEdge",
                  },
                  {
                    node: {
                      image: {
                        originalSrc:
                          "https://cdn.shopify.com/s/files/1/0532/6018/9875/products/8822364_101_500x500.jpg?v=1611449011",
                        __typename: "Image",
                      },
                      product: {
                        id: "gid://shopify/Product/6195781337267",
                        priceRange: {
                          maxVariantPrice: {
                            amount: "125.0",
                            __typename: "MoneyV2",
                          },
                          __typename: "ProductPriceRange",
                        },
                        __typename: "Product",
                      },
                      originalTotal: "30.00",
                      quantity: 24,
                      sku: "8822364",
                      title: "Nordic™ ornament (nutcracker)",
                      vendor: "texxture",
                      __typename: "LineItem",
                    },
                    __typename: "LineItemEdge",
                  },
                  {
                    node: {
                      image: {
                        originalSrc:
                          "https://cdn.shopify.com/s/files/1/0532/6018/9875/products/8821331_1_06972c77-f8fa-4120-b9f4-43fe60ed947c_500x500.jpg?v=1611235546",
                        __typename: "Image",
                      },
                      product: {
                        id: "gid://shopify/Product/6195773833395",
                        priceRange: {
                          maxVariantPrice: {
                            amount: "700.0",
                            __typename: "MoneyV2",
                          },
                          __typename: "ProductPriceRange",
                        },
                        __typename: "Product",
                      },
                      originalTotal: "84.00",
                      quantity: 12,
                      sku: "8821331",
                      title: "Alpine™ ornaments (snowflakes: set of 24)",
                      vendor: "texxture",
                      __typename: "LineItem",
                    },
                    __typename: "LineItemEdge",
                  },
                ],
                __typename: "LineItemConnection",
              },
              createdAt: "2021-08-30T11:21:06Z",
              __typename: "Order",
            },
            __typename: "OrderEdge",
          },
          {
            node: {
              id: "gid://shopify/Order/4029514154163",
              name: "WH1434",
              totalPrice: "2297.00",
              shippingAddress: {
                address1: "16 Depot Square #60",
                address2: "",
                city: "Peterborough",
                company: "Bowerbird & Friends",
                countryCode: "US",
                provinceCode: "NH",
                zip: "03458",
                __typename: "MailingAddress",
              },
              fulfillable: true,
              metafield: {
                value: "false",
                __typename: "Metafield",
              },
              lineItems: {
                edges: [
                  {
                    node: {
                      image: {
                        originalSrc:
                          "https://cdn.shopify.com/s/files/1/0532/6018/9875/products/8822751_101_500x500.jpg?v=1611446895",
                        __typename: "Image",
                      },
                      product: {
                        id: "gid://shopify/Product/6195782287539",
                        priceRange: {
                          maxVariantPrice: {
                            amount: "1500.0",
                            __typename: "MoneyV2",
                          },
                          __typename: "ProductPriceRange",
                        },
                        __typename: "Product",
                      },
                      originalTotal: "360.00",
                      quantity: 24,
                      sku: "8822751",
                      title: "Aspen™ tree (6.75 inches: set of 6)",
                      vendor: "texxture",
                      __typename: "LineItem",
                    },
                    __typename: "LineItemEdge",
                  },
                  {
                    node: {
                      image: {
                        originalSrc:
                          "https://cdn.shopify.com/s/files/1/0532/6018/9875/products/8822752_101_500x500.jpg?v=1611446899",
                        __typename: "Image",
                      },
                      product: {
                        id: "gid://shopify/Product/6195782615219",
                        priceRange: {
                          maxVariantPrice: {
                            amount: "350.0",
                            __typename: "MoneyV2",
                          },
                          __typename: "ProductPriceRange",
                        },
                        __typename: "Product",
                      },
                      originalTotal: "84.00",
                      quantity: 24,
                      sku: "8822752",
                      title: "Aspen™ tree (11.5 inches)",
                      vendor: "texxture",
                      __typename: "LineItem",
                    },
                    __typename: "LineItemEdge",
                  },
                  {
                    node: {
                      image: {
                        originalSrc:
                          "https://cdn.shopify.com/s/files/1/0532/6018/9875/products/7003493_101_500x500.jpg?v=1611447288",
                        __typename: "Image",
                      },
                      product: {
                        id: "gid://shopify/Product/6195751092403",
                        priceRange: {
                          maxVariantPrice: {
                            amount: "350.0",
                            __typename: "MoneyV2",
                          },
                          __typename: "ProductPriceRange",
                        },
                        __typename: "Product",
                      },
                      originalTotal: "105.00",
                      quantity: 30,
                      sku: "7003493",
                      title: "Chiku™ long spoon",
                      vendor: "texxture",
                      __typename: "LineItem",
                    },
                    __typename: "LineItemEdge",
                  },
                  {
                    node: {
                      image: {
                        originalSrc:
                          "https://cdn.shopify.com/s/files/1/0532/6018/9875/products/3459604_101_500x500.jpg?v=1611234851",
                        __typename: "Image",
                      },
                      product: {
                        id: "gid://shopify/Product/6195737788595",
                        priceRange: {
                          maxVariantPrice: {
                            amount: "750.0",
                            __typename: "MoneyV2",
                          },
                          __typename: "ProductPriceRange",
                        },
                        __typename: "Product",
                      },
                      originalTotal: "90.00",
                      quantity: 12,
                      sku: "3459604",
                      title: "Upland™ tape measure",
                      vendor: "texxture",
                      __typename: "LineItem",
                    },
                    __typename: "LineItemEdge",
                  },
                ],
                __typename: "LineItemConnection",
              },
              createdAt: "2021-09-20T19:54:21Z",
              __typename: "Order",
            },
            __typename: "OrderEdge",
          },
        ],
        __typename: "OrderConnection",
      },
      phone: null,
      ordersCount: "3",
      tags: ["42370_cus_no"],
      taxExempt: true,
      taxExemptions: [],
      totalSpent: "5599.00",
      __typename: "Customer",
    },
  };

  console.log(data);

  let matafieldsArr = data.customer.metafields.edges;
  let ordersArr = data.customer.orders.edges;
  let customerNumberObj = matafieldsArr.find(
    (o) => o.node.namespace === "Customer Number" && o.node.key === "cus_no"
  );
  let resaleNumberObj = matafieldsArr.find(
    (o) => o.node.namespace === "Resale Number" && o.node.key === "res_no"
  );
  let cusNumb = customerNumberObj ? customerNumberObj.node.value : "";

  return (
    <main>
      <ButtonNav
        back="customers"
        cnumb={{
          display: true,
          cnumbObj: customerNumberObj ? customerNumberObj.node : {},
          globalId: globalId,
          varified: true,
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
                <i>{data.customer.ordersCount} Orders</i>
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
                <h3>Resale Number: {resaleNumberObj.node.value}</h3>
              ) : (
                ""
              )}
              <h3>Shopify id: {id}</h3>
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
          discountObj={{ value: 5 }}
        />
        <Orders fields={ordersArr} />
        <MatafieldSection fields={matafieldsArr} customerId={globalId} />
        <section className="disabled">Wishlist</section>
        <section className="disabled">Interests</section>
        <section className="disabled">Reviews</section>
        <section className="disabled">Alerts</section>
        <section className="disabled">Rewards</section>
      </div>
    </main>
  );
};
export default CustomerPage;

// /<h3>Jained {data.customer.lifetimeDuration} ago</h3>
