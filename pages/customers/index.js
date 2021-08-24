import Link from "next/link";

export default function SpecialPage({}) {
  return (
    <main>
      <Link href="/">
        <button>Back to dashboard</button>
      </Link>
      <section>
        <h1>Customers</h1>
        <p className="light">
          Search, sort and select a store customer from the list below to edit
          things like customer number, metafields and membership points.
        </p>

        <ul className="large-list ">
          <li className="list-header">
            <span>Pic</span> <span>Name</span> <span>Orders</span>
          </li>
          <li>
            <Link href="/customers/1">
              <div className="flex-center-btw">Customer 1</div>
            </Link>
          </li>
          <li>
            <Link href="/customers/1">Customer 2</Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
