import React from "react";
import Link from "next/link";
import Back from "../media/icons/Back.js";
import Dash from "../media/icons/Dashboard.js";
import MoreButton from "./MoreButton.js";
import CustomerNumber from "./CustomerNumber.js";
import { useRouter } from "next/router";

export default function SpecialPage(props) {
  // let link = props.back ? `/${props.back}` : "/";
  const router = useRouter();

  return (
    <div className="flex-center-btw" style={{ marginBottom: "16px" }}>
      <div className="flex-center-left">
        <button style={{ marginRight: "8px" }} onClick={() => router.back()}>
          <Back />
          Back
        </button>
        <Link href="/">
          <button>
            <Dash />
            Dashboard
          </button>
        </Link>
      </div>
      <div className="flex-center-right">
        {props.cnumb && props.cnumb.display ? (
          <CustomerNumber data={props.cnumb} />
        ) : (
          ""
        )}
        <MoreButton />
      </div>
    </div>
  );
}
