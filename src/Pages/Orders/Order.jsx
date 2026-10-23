import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../Components/Layout/Layout";
import ProductCard from "../../Components/Product/ProductCard";
import { DataContext } from "../../Components/DataProvider/DataProvider";
import { db } from "../../Utility/firebase";
import classes from "./Orders.module.css";

function Order() {
  const [{ user }] = useContext(DataContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    if (!user?.uid) {
      setOrders([]);
      setLoading(false);
      return () => {
        active = false;
      };
    }

    setLoading(true);
    setError("");
    db.collection("users")
      .doc(user.uid)
      .collection("orders")
      .orderBy("created", "desc")
      .get()
      .then((snapshot) => {
        if (active) {
          setOrders(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        }
      })
      .catch((loadError) => {
        if (active) setError(loadError.message || "Please try again.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [user?.uid]);

  return (
    <Layout>
      <main className={classes.page}>
        <header className={classes.pageHeader}>
          <div>
            <p className={classes.eyebrow}>Your account</p>
            <h1>Your orders</h1>
            <p className={classes.subtitle}>View your recent purchases and order details.</p>
          </div>
          {!loading && !error && orders.length > 0 && (
            <span className={classes.orderCount}>
              {orders.length} {orders.length === 1 ? "order" : "orders"}
            </span>
          )}
        </header>

        {loading && <p className={classes.notice}>Loading your orders…</p>}
        {error && (
          <div className={`${classes.notice} ${classes.error}`} role="alert">
            We couldn’t load your orders. {error}
          </div>
        )}
        {!loading && !error && orders.length === 0 && (
          <section className={classes.empty}>
            <h2>No orders yet</h2>
            <p>Your purchases will show up here after checkout.</p>
            <Link className={classes.shopLink} to="/">Continue shopping</Link>
          </section>
        )}

        <div className={classes.orderList}>
          {orders.map((order) => {
            const items = Array.isArray(order.basket) ? order.basket : [];
            const orderDate = order.created
              ? new Date(order.created * 1000).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "Date unavailable";

            return (
              <article className={classes.orderCard} key={order.id}>
                <header className={classes.orderMeta}>
                  <div>
                    <span className={classes.metaLabel}>Order placed</span>
                    <strong>{orderDate}</strong>
                  </div>
                  <div className={classes.orderId}>
                    <span className={classes.metaLabel}>Order ID</span>
                    <strong title={order.id}>{order.id}</strong>
                  </div>
                  <div className={classes.total}>
                    <span className={classes.metaLabel}>Total</span>
                    <strong>
                      {typeof order.amount === "number"
                        ? new Intl.NumberFormat(undefined, {
                            style: "currency",
                            currency: "USD",
                          }).format(order.amount / 100)
                        : "—"}
                    </strong>
                  </div>
                </header>
                <div className={classes.orderItems}>
                  {items.length ? (
                    items.map((item, index) => (
                      <ProductCard
                        key={item.id || `${order.id}-${index}`}
                        flex
                        product={item}
                      />
                    ))
                  ) : (
                    <p className={classes.noItems}>No item details saved for this order.</p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </main>
    </Layout>
  );
}

export default Order;
