import React, { useEffect, useState } from "react";
import { Page, Layout, EmptyState } from "@shopify/polaris";
import { authenticateShopifyPage } from "@bluebeela/nextjs-shopify-auth";
import { ResourcePicker, TitleBar } from "@shopify/app-bridge-react";
import store from "store-js";
import ResourceListWithProducts from "../components/ResourceList";
import Link from "next/link";

//icons
import CustomersIcon from "../media/icons/Customers.js";
import Alerts from "../media/icons/Alerts.js";
import Indexer from "../media/icons/Indexer.js";
import Membership from "../media/icons/Membership.js";
import Orders from "../media/icons/Orders.js";
import Reviews from "../media/icons/Reviews.js";
import Products from "../media/icons/Products.js";

const img = "https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg";

let linkMap = [
  {
    title: "Customers",
    link: "customers",
    img: CustomersIcon,
    description: "Read and edit customer information.",
    active: true,
  },
  {
    title: "Orders",
    link: "orders",
    img: Orders,
    description: "Read and edit orders and their status.",
    active: true,
  },
  {
    title: "Products",
    link: "products",
    img: Products,
    description: "Read and edit products and their metafields.",
    active: true,
  },
  {
    title: "Membership Program",
    link: "customers",
    img: Membership,
    description: "Add rules and monitor membership points.",
    active: false,
  },
  {
    title: "Alert Settings",
    link: "customers",
    img: Alerts,
    description: "Adjust alert cadence and triggers.",
    active: false,
  },
  {
    title: "Reviews",
    link: "customers",
    img: Reviews,
    description: "Monitor customer reviews and how they appear.",
    active: false,
  },
  {
    title: "Indexer",
    link: "customers",
    img: Indexer,
    description: "Adjust the sites search and filter settings.",
    active: false,
  },
];
const Index = () => {
  return (
    <main>
      <section>
        <h1>Dashboard</h1>

        <p className="light">
          <span>
            Welcome to the DI Admin app. From here you can control any of the
            custom features developed outside of Shopify. If you have any
            questions, feature requests or issues please contact{" "}
            <a href="mailto:matt@mwolfe.io">customer support</a>.
          </span>
        </p>

        <ul className="large-list ">
          {linkMap.map((link) => {
            let Comp = link.img ? link.img : CustomersIcon;
            return (
              <li
                className={`flex-center-btw ${
                  !link.active ? "disabled-link" : ""
                }`}
              >
                <Link href={link.active ? link.link : ""}>
                  <div className="flex-center-btw">
                    <div className="flex-center-left">
                      <span
                        style={{
                          marginRight: "24px",
                          opacity: link.active ? 1 : 0.4,
                        }}
                      >
                        <Comp />
                      </span>
                      <div>
                        <p>{link.title}</p>
                        <p className="subtitle">{link.description}</p>
                      </div>
                    </div>
                    <span className="svg-container flex-center-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="#b0b7c3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M9.5 7l5 5-5 5"
                        ></path>
                      </svg>
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
};

export const getServerSideProps = authenticateShopifyPage();

export default Index;
