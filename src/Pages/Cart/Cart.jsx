import React, { useContext } from "react";
import Layout from "../../Components/Layout/Layout";
import { DataContext } from "../../Components/DataProvider/DataProvider";
import ProductCard from "../../Components/Product/ProductCard";
import CurrencyFormat from "../../Components/CurrencyFormat/CurrencyFormat";
import styles from "./Cart.module.css";
import { Link } from "react-router-dom";

function Cart() {
  const [{ basket = [], user }] = useContext(DataContext);
  const subtotal = basket.reduce(
    (total, item) => total + item.price * (item.quantity || 1),
    0,
  );
  const itemCount = basket.reduce(
    (total, item) => total + (item.quantity || 1),
    0,
  );

  return (
    <Layout>
      <section className={styles.cartPage}>
        <div className={styles.cartContent}>
          <div className={styles.cartItems}>
            <header className={styles.cartHeader}>
              <p className={styles.greeting}>
                Hello{user?.name ? `, ${user.name}` : ""}
              </p>
              <h1>Your Shopping Basket</h1>
            </header>

            {basket.length === 0 ? (
              <div className={styles.emptyCart}>
                <h2>Your basket is empty</h2>
                <p>Browse products and add something you like.</p>
              </div>
            ) : (
              <div className={styles.productList}>
                {basket.map((item, index) => (
                  <ProductCard
                    key={`${item.id}-${index}`}
                    product={item}
                    renderDisc
                    flex
                  />
                ))}
              </div>
            )}
          </div>

          {basket.length > 0 && (
            <aside className={styles.orderSummary}>
              <p className={styles.deliveryMessage}>
                Your order qualifies for free delivery.
              </p>
              <p className={styles.subtotal}>
                Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"}):
                <strong>
                  <CurrencyFormat amount={subtotal} />
                </strong>
              </p>
              <Link to="/payment">
                <button className={styles.checkoutButton} type="button">
                  Proceed to checkout
                </button>
              </Link>
            </aside>
          )}
        </div>
      </section>
    </Layout>
  );
}

export default Cart;
