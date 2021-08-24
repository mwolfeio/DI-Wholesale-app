import Link from "next/link";

export default function SpecialPage({}) {
  return (
    <main>
      <h1>Customer</h1>
      <Link href="/customer">
        <button>Back to Customers</button>
      </Link>
      <ul>
        <li>Information</li>
        <li>metafields</li>
        <li>Wishlist</li>
        <li>Interests</li>
        <li>Reviews</li>
        <li>Alerts</li>
        <li>Rewards</li>
      </ul>
    </main>
  );
}
