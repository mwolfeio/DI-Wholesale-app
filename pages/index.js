import React, { useEffect, useState } from "react";
import { Page, Layout, EmptyState } from "@shopify/polaris";
import { authenticateShopifyPage } from "@bluebeela/nextjs-shopify-auth";
import { ResourcePicker, TitleBar } from "@shopify/app-bridge-react";
import store from "store-js";
import ResourceListWithProducts from "../components/ResourceList";
import Link from "next/link";

const img = "https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg";

const Index = () => {
  return (
    <main>
      <h1>Dashboard</h1>
      <ul>
        <li>
          <Link href="/wishlist">
            <button>Wishlist</button>
          </Link>
        </li>
      </ul>
    </main>
  );
};

export const getServerSideProps = authenticateShopifyPage();

export default Index;
