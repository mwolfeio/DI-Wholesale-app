import Link from "next/link";
import ButtonNav from "../../components/ButtonNav.js";

import CustomerList from "../../components/lists/CustomerList.js";

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
          <CustomerList
            customer={{
              id: "1",
              name: "Customer Name",
              email: "email@email.com",
              cusnumb: "00000",
              orders: "0",
              age: "0m 0d",
            }}
          />
        </ul>
        <div className="flex-center-center">
          <button>Load more</button>
        </div>
      </section>
    </main>
  );
}
