import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../../Components/Layout/Layout";
import axios from "axios";
import Rating from "@mui/material/Rating";
import { productURl } from "../../Api/Api";
import CurrencyFormat from "../../Components/CurrencyFormat/CurrencyFormat";
import classes from "./ProductDetails.module.css";
import Loader from "../../Components/Loader/Loader";
import { DataContext } from "../../Components/DataProvider/DataProvider";
import { Type } from "../../Utility/actionTypes";

function ProductDetails() {
  const [, dispatch] = useContext(DataContext);
  const [product, setProduct] = useState(null);
  const { productId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [addedToCart, setAddedToCart] = useState(false);

  const addToCart = () => {
    if (!product) return;

    dispatch({
      type: Type.ADD_TO_BASKET,
      item: {
        title: product.title,
        id: product.id,
        image: product.image,
        rating: product.rating,
        price: product.price,
      },
    });
    setAddedToCart(true);
  };

  useEffect(() => {
    let isCurrent = true;
    setIsLoading(true);
    setError("");

    axios
      .get(`${productURl}/products/${productId}`)
      .then((res) => {
        if (isCurrent) setProduct(res.data);
      })
      .catch((err) => {
        console.error("Could not load product:", err);
        if (isCurrent) {
          setProduct(null);
          setError("Could not load this product. Please try again.");
        }
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [productId]);

  useEffect(() => {
    setAddedToCart(false);
  }, [productId]);

  return (
    <Layout>
      {isLoading && <Loader />}
      <main className={classes.productDetails}>
        {!isLoading && error ? (
          <p className={classes.statusMessage} role="alert">
            {error}
          </p>
        ) : !isLoading && !product ? (
          <p className={classes.statusMessage}>Product not found.</p>
        ) : !isLoading ? (
          <article className={classes.productPanel}>
            <div className={classes.imageContainer}>
              <img
                className={classes.productImage}
                src={product.image}
                alt={product.title}
              />
            </div>

            <div className={classes.productInfo}>
              {product.category && (
                <p className={classes.category}>{product.category}</p>
              )}
              <h1 className={classes.productTitle}>{product.title}</h1>

              {product.rating && (
                <div className={classes.rating}>
                  <Rating
                    value={product.rating.rate}
                    precision={0.1}
                    readOnly
                  />
                  <span>
                    {product.rating.rate} ({product.rating.count} reviews)
                  </span>
                </div>
              )}

              <p className={classes.price}>
                <CurrencyFormat amount={product.price} />
              </p>
              <p className={classes.description}>{product.description}</p>
              <button
                className={classes.addToCartButton}
                type="button"
                onClick={addToCart}
                aria-live="polite"
              >
                {addedToCart ? "Added to Cart" : "Add to Cart"}
              </button>
            </div>
          </article>
        ) : null}
      </main>
    </Layout>
  );
}

export default ProductDetails;
