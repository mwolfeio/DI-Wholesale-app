import { useState, useEffect } from "react";
import { useMutation } from "react-apollo";
import { gql } from "apollo-boost";

import SectionHeader from "./SectionHeader.js";
import MetafieldInput from "./MetafieldInput.js";

import MoreButton from "../MoreButton.js";

//graphql
const UPDATE_PRODUCT = gql`
  mutation productUpdate(
    $input: ProductInput!
    $namespace: String!
    $key: String!
  ) {
    productUpdate(input: $input) {
      product {
        metafield(namespace: $namespace, key: $key) {
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

  //Query
  const [deleteField, { load, erro, da }] = useMutation(DELETE_FIELD);
  const [productUpdate, { productLoading, productError, productData }] =
    useMutation(UPDATE_PRODUCT);

  //handlers
  const toggleOpen = () => {
    setOpen(!open);
  };
  const submitHandler = (e) => {
    e.preventDefault();

    let payload = fieldId
      ? {
          variables: {
            input: {
              id: globalId,
              metafields: {
                id: fieldId,
                value: searchTermArray.join(", "),
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
                value: searchTermArray.join(", "),
                valueType: "STRING",
              },
            },
          },
        };

    productUpdate(payload)
      .then((returnedData) =>
        updateState(returnedData.data.productUpdate.product.metafield)
      )
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
        <div className="card-container">
          <div className="card">
            {" "}
            {searchTermArray.map((term) => (
              <div>term</div>
            ))}{" "}
          </div>
        </div>
      )}
    </section>
  );
};
export default Section;
