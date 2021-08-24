import Link from "next/link";
import ButtonNav from "../../components/ButtonNav.js";

import CustomersIcon from "../../media/icons/Customers.js";

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
          <Link href="/customers/1">
            <li className="">
              <CustomersIcon />

              <div
                className="list-name"
                style={{ marginLeft: "16px", justifySelf: "start" }}
              >
                <p>First Last</p>
                <p className="subtitle">email@email.com</p>
              </div>

              <p>000000</p>
              <p>0</p>
              <p>0m 0d</p>
            </li>
          </Link>
        </ul>
        <div className="flex-center-center">
          <button>Load more</button>
        </div>
      </section>
    </main>
  );
}
