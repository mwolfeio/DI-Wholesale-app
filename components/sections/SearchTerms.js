import { useState, useEffect } from "react";
import { useMutation } from "react-apollo";
import { gql } from "apollo-boost";

import SectionHeader from "./SectionHeader.js";
import MetafieldInput from "./MetafieldInput.js";

import MoreButton from "../MoreButton.js";

//graphql
const UPDATE_PRODUCT = gql`
  mutation productUpdate($input: ProductInput!) {
    productUpdate(input: $input) {
      product {
        metafield(namespace: "Search Terms", key: "srch_trm") {
          id
          namespace
          key
          value
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;
const DELETE_FIELD = gql`
  mutation MetafieldDelete($input: MetafieldDeleteInput!) {
    metafieldDelete(input: $input) {
      deletedId
      userErrors {
        field
        message
      }
    }
  }
`;

const Section = ({ arr, id, globalId }) => {
  const [open, setOpen] = useState(true);
  const [searchTermArray, setSearchTermArray] = useState(arr);
  const [fieldId, setFieldId] = useState(id);
  const [input, setInput] = useState("");

  //Query
  const [deleteField, { load, erro, da }] = useMutation(DELETE_FIELD);
  const [productUpdate, { productLoading, productError, productData }] =
    useMutation(UPDATE_PRODUCT);

  //handlers
  const toggleOpen = () => {
    setOpen(!open);
  };
  const deleteMetafield = () => {
    let payload = {
      variables: {
        input: {
          id: fieldId,
        },
      },
    };

    console.log("deleting: ", payload);
    deleteField(payload)
      .then(() => {
        setSearchTermArray([]);
        setFieldId("");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const submitHandler = () => {
    // e.preventDefault();

    let newTermsArr = input.split(", ");
    let allTermsArr = [...searchTermArray, ...newTermsArr];

    console.log("fieldId:", fieldId);
    console.log("allTermsArr:", allTermsArr);
    if (!allTermsArr.length) return deleteMetafield();

    let payload = fieldId
      ? {
          variables: {
            input: {
              id: globalId,
              metafields: {
                id: fieldId,
                value: allTermsArr.join(", "),
                valueType: "STRING",
              },
            },
          },
        }
      : {
          variables: {
            input: {
              id: globalId,
              metafields: {
                namespace: "Search Terms",
                key: "srch_trm",
                value: allTermsArr.join(", "),
                valueType: "STRING",
              },
            },
          },
        };

    console.log("submitting: ", payload);

    productUpdate(payload)
      .then((returnedData) => {
        console.log("returnedData: ", returnedData);
        let resObj = returnedData.data.productUpdate.product.metafield;
        setInput("");
        setFieldId(resObj.id);
        setSearchTermArray(allTermsArr);
      })
      .catch((err) => console.log(err));
  };

  const removeTerm = (i) => {
    setSearchTermArray(searchTermArray.splice(i, 1));
    submitHandler();
  };

  useEffect(() => {
    setSearchTermArray(arr);
  }, [arr]);
  useEffect(() => {
    setFieldId(id);
  }, [id]);

  return (
    <section>
      <SectionHeader
        status={open}
        minimize={toggleOpen}
        title={`Search Terms (${searchTermArray.length})`}
      />
      {open && (
        <div>
          <p
            className="subtitle"
            style={{
              lineHeight: "22px",
              fontSize: "14px",
              width: "700px",
              margin: "-8px 0 20px",
              maxWidth: "Calc(100% - 120px)",
            }}
          >
            Add terms you would like to be associated with this product. These
            terms will help customers locate your product when searching on your
            storefront. You can submit multiple terms separated by a comma and a
            space. Terms can contain spaces characters.
          </p>
          <div className="flex-center-center" style={{ marginBottom: "16px" }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter your terms (eg. term A, term B, etc..)"
            />
            <button
              className=""
              style={{ margin: "0 8px", opacity: input ? 1 : 0.5 }}
              onClick={() => setInput("")}
              disabled={input ? false : true}
            >
              clear
            </button>
            <button
              onClick={submitHandler}
              style={{ opacity: input ? 1 : 0.5 }}
              className={input && "submit-button"}
              disabled={input ? false : true}
            >
              Submit
            </button>
          </div>
          <div
            className="card-container flex-top-left "
            style={{ minHeight: "80px" }}
          >
            {searchTermArray.length ? (
              searchTermArray.map((term) => (
                <div
                  style={{ color: "#4e5d78" }}
                  className="search-term-tag flex-center-center"
                >
                  {term}
                  <div style={{ color: "#b0b7c3" }}>
                    <svg
                      viewBox="0 0 20 20"
                      style={{ height: "18px", width: "18px" }}
                    >
                      <path
                        fill="currentColor"
                        d="m11.414 10 4.293-4.293a.999.999 0 1 0-1.414-1.414L10 8.586 5.707 4.293a.999.999 0 1 0-1.414 1.414L8.586 10l-4.293 4.293a.999.999 0 1 0 1.414 1.414L10 11.414l4.293 4.293a.997.997 0 0 0 1.414 0 .999.999 0 0 0 0-1.414L11.414 10z"
                      ></path>
                    </svg>
                  </div>
                </div>
              ))
            ) : (
              <div
                className="flex-center-center"
                style={{ background: "none" }}
              >
                <p className="subtitle" style={{ fontSize: "14px" }}>
                  No terms yet
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
export default Section;
