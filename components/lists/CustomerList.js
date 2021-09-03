import Link from "next/link";

import CustomersIcon from "../../media/icons/Customers.js";

export default function SpecialPage(props) {
  console.log(props);
  return (
    <Link href={`/customers/${props.customer.id}$`} passHref>
      <li
        className=""
        style={{ animationDelay: `${props.index * 0.03}s` }}
        key={`customer-list-item-${props.index}`}
      >
        <CustomersIcon />
        <div
          className="list-name"
          style={{ marginLeft: "16px", justifySelf: "start" }}
        >
          <p>{props.customer.name}</p>
          <p className="subtitle">{props.customer.email}</p>
        </div>
        <p>{props.customer.cusnumb ? `#${props.customer.cusnumb}` : ""}</p>
        <p>{props.customer.orders}</p>
        <p>{props.customer.age}</p>
      </li>
    </Link>
  );
}
