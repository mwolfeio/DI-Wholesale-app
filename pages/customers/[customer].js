import Link from "next/link";
import ButtonNav from "../../components/ButtonNav.js";

export default function SpecialPage({}) {
  return (
    <main>
      <ButtonNav back="/customers" />

      <h1>Customer</h1>

      <section>Information</section>
      <section>metafields</section>
      <section>Wishsectionst</section>
      <section>Interests</section>
      <section>Reviews</section>
      <section>Alerts</section>
      <section>Rewards</section>
    </main>
  );
}
