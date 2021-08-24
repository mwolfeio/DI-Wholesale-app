import Link from "next/link";

export default function SpecialPage({}) {
  return (
    <main>
      <h1>Customers</h1>
      <Link href="/">
        <button>Back to dashboard</button>
      </Link>
      <ul>
        <li>
          <Link href="/customer 1">Customer 1</Link>
        </li>
        <li>
          <Link href="/customer 1">Customer 2</Link>
        </li>
      </ul>
    </main>
  );
}
