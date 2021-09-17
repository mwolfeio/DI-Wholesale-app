import Link from "next/link";
import moment from "moment";

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

let animationDelayCalc = (index) => {
  let mod = index % 50;
  return mod * 0.03;
};

const customerLink = (id, e) => {
  e.stopPropagation();
  console.log("clicked and going to /customers/", id);
  window.location.href = `/customers/${id}`;
};

export default function SpecialPage(props) {
  console.log("orderList: ", props);

  let date = new Date(props.order.createdAt);
  let customerId = props.order.customerId
    ? props.customerId.order.replace("gid://shopify/Customer/", "")
    : "";

  return (
    <Link href={`/orders/${props.order.id}`} passHref>
      <li
        className=""
        style={{ animationDelay: `${animationDelayCalc(props.index)}s` }}
        key={`order-list-item-${props.index}`}
      >
        <div className="list-name" style={{ justifySelf: "start" }}>
          <p>{props.order.number}</p>
          <p className="subtitle">
            {props.order.dropShip ? (
              <span style={{ color: "#4388f8" }}>Drop Shipping</span>
            ) : (
              "Wholesale"
            )}
          </p>
        </div>

        <div className="list-name" style={{ justifySelf: "start" }}>
          <p>{moment(date).format("MMM Do YYYY")}</p>
          <p className="subtitle">{moment(date).fromNow()}</p>
        </div>

        <div
          className="list-name inter-list-link"
          onClick={(e) => customerLink(customerId, e)}
          style={{ justifySelf: "start" }}
        >
          <p>{props.order.name}</p>
          <p className="subtitle">{truncate(props.order.company)}</p>
        </div>

        <div className="list-name flex-center-column">
          <p>{props.order.orders}</p>
          <p className="subtitle flex-center-column">
            {formatter.format(props.order.totalSpent)}
          </p>
        </div>
        <div
          className="list-name flex-right-column"
          style={{
            display: "flex",
            justifyContent: "end",
            flexDirection: "column",
          }}
        >
          {props.order.fulfillable ? (
            <div className="tinny-tag flex-center-center complete-tiny-tab ">
              Unfulfilled
            </div>
          ) : (
            <div className="tinny-tag flex-center-center dissabled-tiny-tab">
              Fulfilled
            </div>
          )}
        </div>
      </li>
    </Link>
  );
}

// <ListInput
//   cusId={props.order.gid}
//   fieldId={props.order.fieldId}
//   cnumb={props.order.cusnumb}
// />

// <div
//   className="tinny-tag active-tiny-tab flex-center-center"
//   style={{
//     position: "absolute",
//     top: "-4px",
//     left: "-4px",
//     width: "auto",
//   }}
// >
//   Drop Ship
// </div>
