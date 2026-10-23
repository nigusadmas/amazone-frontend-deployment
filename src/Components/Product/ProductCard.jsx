import React, { useContext } from "react";
import Rating from "@mui/material/Rating";
import CurrencyFormat from "../CurrencyFormat/CurrencyFormat";
import styles from "./Product.module.css";
import { Link } from "react-router-dom";
import { DataContext } from "../DataProvider/DataProvider";
import { Type } from "../../Utility/actionTypes";

const ProductCard = ({ product, flex = false }) => {
  const { title, id, image, rating, price } = product;

  const [, dispatch] = useContext(DataContext);

  const addtoCart = () => {
    dispatch({
      type: Type.ADD_TO_BASKET,
      item: {
        title,
        id,
        image,
        rating,
        price,
      },
    });
  };

  const changeQuantity = (change) => {
    dispatch({
      type: Type.UPDATE_BASKET_QUANTITY,
      id,
      change,
    });
  };

  return (
    <div
      className={`${styles.productCard} ${flex ? styles.cartProductCard : ""}`}
    >
      <Link to={`/products/${id}`}>
        <img src={image} alt={title} className={styles.productImage} />
      </Link>

      <div className={styles.productInfo}>
        <h3 className={styles.productTitle}>{title}</h3>

        <div className={styles.ratingContainer}>
          <Rating value={rating?.rate || 0} precision={0.1} readOnly />
          <small>{rating?.count}</small>
        </div>

        <div className={styles.price}>
          <CurrencyFormat amount={price} />
        </div>

        {flex && (
          <div className={styles.quantityControls}>
            <button
              type="button"
              onClick={() => changeQuantity(-1)}
              aria-label={`Decrease quantity of ${title}`}
            >
              −
            </button>
            <span aria-live="polite">{product.quantity || 1}</span>
            <button
              type="button"
              onClick={() => changeQuantity(1)}
              aria-label={`Increase quantity of ${title}`}
            >
              +
            </button>
          </div>
        )}

        {!flex && (
          <button className={styles.cartBtn} onClick={addtoCart}>
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
