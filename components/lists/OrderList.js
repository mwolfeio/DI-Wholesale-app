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

  window.location.href = `/customers/${id}`;
};

export default function SpecialPage(props) {
  console.log("orderList: ", props);

  let currentDate = new Date();
  let date = new Date(props.order.createdAt);
  let shiptDate = props.order.shiptDate ? new Date(props.order.shiptDate) : "-";
  let customerId = props.order.customerId
    ? props.order.customerId.replace("gid://shopify/Customer/", "")
    : "";

  return (
    <Link href={`/orders/${props.order.id}`} passHref>
      <li
        className={
          currentDate > shiptDate && props.order.fulfillable
            ? "past-due-list-item"
            : ""
        }
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
          <p>{moment(date).format("MMM D, YYYY")}</p>
          <p className="subtitle">{moment(date).fromNow()}</p>
        </div>

        <div className="list-name" style={{ justifySelf: "start" }}>
          <p className="hilight">
            {props.order.shiptDate
              ? moment(shiptDate).format("MMM D, YYYY")
              : shiptDate}
          </p>
          <p className="subtitle hilight">
            {props.order.shiptDate ? moment(shiptDate).fromNow() : "-"}
          </p>
        </div>

        <div
          className="list-name inter-list-link"
          onClick={(e) => customerLink(customerId, e)}
          style={{ justifySelf: "start" }}
        >
          <p>{props.order.name}</p>
          <p className="subtitle">{truncate(props.order.company)}</p>
        </div>

        <ListInput
          cusId={props.order.gid}
          fieldId={props.order.customerNumber.id}
          cnumb={props.order.customerNumber.value}
          varifyId={props.order.customerNumberVarified.id}
          varfiedValue={props.order.customerNumberVarified.value}
        />

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
            <div
              style={{ fontSize: "10px", padding: "0 10px", width: "auto" }}
              className="tinny-tag flex-center-center complete-tiny-tab "
            >
              Unfulfilled
            </div>
          ) : (
            <div
              style={{ padding: "0 10px", width: "auto" }}
              className="tinny-tag flex-center-center dissabled-tiny-tab"
            >
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

// <div className="list-name flex-center-column">
//   <p>
//     {props.order.customerNumber
//       ? `#${props.order.customerNumber.value}`
//       : "no CN"}
//   </p>
//
//   {props.order.customerNumberVarified &&
//     props.order.customerNumberVarified.value == "true" && (
//       <p
//         className="subtitle flex-center-column"
//         style={{ color: "#e4545d" }}
//       >
//         Unverified
//       </p>
//     )}
// </div>

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
