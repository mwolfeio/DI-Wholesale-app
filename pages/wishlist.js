import Link from "next/link";

export default function SpecialPage({}) {
  return (
    <main>
      <h1>Test</h1>
      <Link href="/">
        <button>Back to dashboard</button>
      </Link>
    </main>
  );
}
