import Link from "next/link";
import ButtonNav from "../../components/ButtonNav.js";

// import { gql, useQuery } from "react-apollo";

import CustomerList from "../../components/lists/CustomerList.js";

// import DataTable from "../../compo/nents/DataTable.js";

export default function SpecialPage({}) {
  return (
    <main>
      <ButtonNav />
      <section>
        <h1>Customers</h1>
        <p className="light">
          Search, sort and select a store customer from the list below to edit
          things like customer number, metafields and membership points.
        </p>
        <ul className="large-list customer-list">
          <li className="list-header">
            <p>Pic</p>
            <p style={{ marginLeft: "16px", justifySelf: "start" }}>Name</p>
            <p>Custoemr #</p>
            <p>Orders</p>
            <p>Age</p>
          </li>
        </ul>
        <div className="flex-center-center">
          <button>Load more</button>
        </div>
      </section>
    </main>
  );
}
