import React, { useEffect, useState } from "react";
import { Page, Layout, EmptyState } from "@shopify/polaris";
import { authenticateShopifyPage } from "@bluebeela/nextjs-shopify-auth";
import { ResourcePicker, TitleBar } from "@shopify/app-bridge-react";
import store from "store-js";
import ResourceListWithProducts from "../components/ResourceList";
import Link from "next/link";

import "../style/global.css";

const img = "https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg";

let linkMap = [
  { title: "Customers", link: "customers", img: "", description: "" },
  { title: "Orders", link: "customers", img: "", description: "" },
  { title: "Membership Program", link: "customers", img: "", description: "" },
  { title: "Alert Settings", link: "customers", img: "", description: "" },
  { title: "Reviews", link: "customers", img: "", description: "" },
  { title: "Indexer", link: "customers", img: "", description: "" },
];

const Index = () => {
  return (
    <main>
      <section>
        <h1>Dashboard</h1>
        <ul class="large-list ">
          {linkMap.map((link) => {
            <li class="large-list-item">
              <Link href={link.link} class="flex-center-btw">
                <div class="flex-center-left">
                  <img src={link.img} />
                  <div>
                    <p>{link.title}</p>
                    <p class="subtitle">{link.description}</p>
                  </div>
                </div>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.5 7L14.5 12L9.5 17"
                    stroke="#b0b7c3"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </Link>
            </li>;
          })}
        </ul>
      </section>
    </main>
  );
};

export const getServerSideProps = authenticateShopifyPage();

export default Index;
