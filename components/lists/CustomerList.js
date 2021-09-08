import Link from "next/link";

import CustomersIcon from "../../media/icons/Customers.js";

var formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function SpecialPage(props) {
  console.log(props);
  return (
    <Link href={`/customers/${props.customer.id}$`} passHref>
      <li
        className=""
        style={{ animationDelay: `${props.index * 0.03}s` }}
        key={`customer-list-item-${props.index}`}
      >
        <div className="list-name" style={{ justifySelf: "start" }}>
          <p>{props.customer.name}</p>
          <p className="subtitle">{props.customer.email}</p>
        </div>

        <div className="list-name" style={{ justifySelf: "start" }}>
          <p>{props.customer.company}</p>
          <p className="subtitle">{props.customer.address}</p>
        </div>
        <p>{props.customer.cusnumb ? `#${props.customer.cusnumb}` : ""}</p>

        <div
          className="list-name"
          style={{ justifySelf: "center", textAligh: "center" }}
        >
          <p>{props.customer.orders}</p>
          <p className="subtitle">
            {formatter.format(props.customer.totalSpent)}
          </p>
        </div>
      </li>
    </Link>
  );
}

//<CustomersIcon />
// <p>{props.customer.age}</p>
