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
  const [input, setInput] = useState(id);

  //Query
  const [deleteField, { load, erro, da }] = useMutation(DELETE_FIELD);
  const [productUpdate, { productLoading, productError, productData }] =
    useMutation(UPDATE_PRODUCT);

  //handlers
  const toggleOpen = () => {
    setOpen(!open);
  };
  const submitHandler = (e) => {
    // e.preventDefault();

    let newTermsArr = input.split(", ");
    let allTermsArr = [...searchTermArray, ...newTermsArr];

    console.log("allTermsArr:", allTermsArr);

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
        console.log(returnedData);
        let resObj = returnedData.data.productUpdate.product.metafield;
        setFieldId(resObj.id);
        setSearchTermArray(resObj.value.split(","));
      })
      .catch((err) => console.log(err));
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
          <div className="card-container" style={{ minHeight: "120px" }}>
            {searchTermArray.length ? (
              <div className="card">
                {searchTermArray.map((term) => (
                  <div>term</div>
                ))}
              </div>
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
