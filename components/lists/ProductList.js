import Link from "next/link";

import CustomersIcon from "../../media/icons/Customers.js";
import ListInput from "./InterlistInput.js";
// import Varify from "./InterlistVarify.js";

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
let getSkuString = (arr) => {
  let skuArr = [];

  arr.forEach((varriant, i) => {
    skuArr.push(varriant.node.sku);
  });

  return skuArr.length > 1
    ? skuArr.join(", ")
    : skuArr.length > 0
    ? skuArr[0]
    : "No SKUs";
};

export default function SpecialPage({ product, index }) {
  let src = product.imgSrc
    ? product.imgSrc
    : "https://i.stack.imgur.com/y9DpT.jpg";

  let skuString = getSkuString(product.variants);

  console.log("ProductList: ", product);
  return (
    <Link href={`/products/${product.id}`} passHref>
      <li
        className=""
        style={{ animationDelay: `${animationDelayCalc(index)}s` }}
        key={`customer-list-item-${index}`}
      >
        <img src={src} />

        <div className="list-name" style={{ justifySelf: "start" }}>
          <p>{product.title}</p>
          <p className="subtitle">{truncate(skuString)}</p>
        </div>

        <div className="list-name flex-center-column">
          <p>{formatter.format(product.price)}</p>
          <p className="subtitle flex-center-column">
            {product.inventory} in stock
          </p>
        </div>

        <div className="list-name">
          <p>{product.type}</p>
        </div>

        <div className="list-name">
          <p>{product.vendor}</p>
        </div>

        <div
          className="list-name flex-right-column"
          style={{
            display: "flex",
            justifyContent: "end",
            flexDirection: "column",
          }}
        >
          {product.status === "ACTIVE" ? (
            <div
              style={{ fontSize: "10px", padding: "0 10px", width: "auto" }}
              className="tinny-tag flex-center-center drop-ship-tiny-tab "
            >
              Active
            </div>
          ) : (
            <div
              style={{ padding: "0 10px", width: "auto" }}
              className="tinny-tag flex-center-center warning-tiny-tab"
            >
              {product.status.charAt(0).toUpperCase() +
                product.status.slice(1).toLowerCase()}
            </div>
          )}
        </div>
      </li>
    </Link>
  );
}
