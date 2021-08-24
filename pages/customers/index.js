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

        <ul className="large-list ">
          <li className="list-header flex-center-btw">
            <div className="list-icon">Pic</div>
            <div className="list-name">Name</div>
            <div className="list-cus-numb">Custoemr #</div>
            <div className="list-cus-order">Orders</div>
            <div className="list-cus-age">Age</div>
          </li>
          <li className="flex-center-btw">
            <Link href="/customers/1">
              <div className="flex-center-btw">
                <div className="flex-center-left">
                  <span className="list-icon">
                    <CustomersIcon />
                  </span>
                  <div className="list-name">
                    <p>First Last</p>
                    <p className="subtitle">email@email.com</p>
                  </div>
                </div>
                <div className="list-cus-numb">000000</div>
                <div className="list-cus-order">0</div>
                <div className="list-cus-age">0m 0d</div>
              </div>
            </Link>
          </li>
        </ul>
        <div className="flex-center-center">
          <button>Load more</button>
        </div>
      </section>
    </main>
  );
}
