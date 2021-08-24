import React, { useEffect, useState } from "react";
import { Page, Layout, EmptyState } from "@shopify/polaris";
import { authenticateShopifyPage } from "@bluebeela/nextjs-shopify-auth";
import { ResourcePicker, TitleBar } from "@shopify/app-bridge-react";
import store from "store-js";
import ResourceListWithProducts from "../components/ResourceList";
import Link from "next/link";

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
        <ul class="large-list ">test</ul>
      </section>
    </main>
  );
};

export const getServerSideProps = authenticateShopifyPage();

export default Index;
