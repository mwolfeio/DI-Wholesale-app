import fetch from "node-fetch";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/client";
import App, { Container } from "next/app";
import Cookies from "js-cookie";
import { AppProvider } from "@shopify/polaris";
import { Provider } from "@shopify/app-bridge-react";
import "@shopify/polaris/dist/styles.css";
import translations from "@shopify/polaris/locales/en.json";
import ClientRouter from "../components/ClientRouter";

import "../style/global.css";

const client = new ApolloClient({
  uri: `https://di-wholesale.myshopify.com/api/shopify/admin/2021-07/graphql`,
  fetch: fetch,
  fetchOptions: {
    credentials: "include",
  },
});

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    const shopOrigin = pageProps.shopOrigin ?? Cookies.get("shopOrigin");
    return (
      <AppProvider i18n={translations}>
        <Provider
          config={{
            apiKey: process.env.API_KEY,
            shopOrigin: shopOrigin,
            forceRedirect: true,
          }}
        >
          <ClientRouter />
          <ApolloProvider client={client}>
            <Component {...pageProps} />
          </ApolloProvider>
        </Provider>
      </AppProvider>
    );
  }
}

export default MyApp;
