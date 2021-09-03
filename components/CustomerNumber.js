import { useState, useMemo, useEffect } from "react";
import { useQuery } from "react-apollo";
import { gql } from "apollo-boost";
import _ from "lodash";
import More from "../media/icons/More.js";

export default function SpecialPage(props) {
  //State
  const [customerNumber, setCustomerNumber] = useState("");
  console.log("customerNumber: ", customerNumber);

  //Handle input
  const changeHandler = (event) => {
    setCustomerNumber(`CN: ${event.target.value}`);
  };
  const debouncedChangeHandler = useMemo(
    () => _.debounce(changeHandler, 300),
    []
  );
  useEffect(() => {
    return () => {
      debouncedChangeHandler.cancel();
    };
  }, []);

  //return component
  return (
    <div className="flex-center-center">
      <input
        onChange={debouncedChangeHandler}
        className="customer-number-input"
        type="text"
        placeholder="No Customer #"
        value={props.cnumb ? `CN: ${props.cnumb}` : ""}
      />
    </div>
  );
}
// <span class=input role="textbox" contenteditable>
//   {props.cnumb}
// </span>
