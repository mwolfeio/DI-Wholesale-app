import Link from "next/link";

import CustomersIcon from "../../media/icons/Customers.js";
import ListInput from "./InterlistInput.js";

var formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

let truncate = (str) => {
  let length = str.length;
  if (length > 28) return `${str.substring(0, 25)}...`;
  else return str;
};

export default function SpecialPage(props) {
  console.log("CustomerList: ", props);
  return (
    <Link href={`/customers/${props.customer.id}`} passHref>
      <li
        className=""
        style={{ animationDelay: `${props.index * 0.03}s` }}
        key={`customer-list-item-${props.index}`}
      >
        <div className="list-name" style={{ justifySelf: "start" }}>
          <p>{props.customer.name}</p>
          <p className="subtitle">{truncate(props.customer.email)}</p>
        </div>

        <div className="list-name" style={{ justifySelf: "start" }}>
          <p>{props.customer.company}</p>
          <p className="subtitle">{props.customer.address}</p>
        </div>

        <ListInput
          cusId={props.customer.gid}
          fieldId={props.customer.fieldId}
          cnumb={props.customer.cusnumb}
        />
        <div
          className="list-name"
          style={{
            display: "flex",
            alignItems: "end",
            flexDirection: "column",
          }}
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
//<p>{props.customer.cusnumb ? `#${props.customer.cusnumb}` : ""}</p>
