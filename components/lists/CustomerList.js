import Link from "next/link";

import CustomersIcon from "../../media/icons/Customers.js";

export default function SpecialPage(props) {
  return (
    <Link href={`/customers/${props.customer.id}`}>
      <li className="">
        <CustomersIcon />
        <div
          className="list-name"
          style={{ marginLeft: "16px", justifySelf: "start" }}
        >
          <p>{props.customer.name}</p>
          <p className="subtitle">{props.customer.email}</p>
        </div>
        <p>{props.customer.cusnumb}</p>
        <p>{props.customer.orders}</p>
        <p>{props.customer.age}</p>
      </li>
    </Link>
  );
}
