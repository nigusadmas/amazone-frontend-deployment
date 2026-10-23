import { useContext, useState } from "react";
import Layout from "../../Components/Layout/Layout";
import classes from "./Payments.module.css";
import { DataContext } from "../../Components/DataProvider/DataProvider";
import ProductCard from "../../Components/Product/ProductCard";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import CurrencyFormat from "../../Components/CurrencyFormat/CurrencyFormat";
import { axiosInstance } from "../../Api/axios";
import { db } from "../../Utility/firebase";
import { Type } from "../../Utility/actionTypes";
import { useNavigate } from "react-router-dom";
function Payment() {
  const [{ user, basket = [] }, dispatch] = useContext(DataContext);
  const [cardError, setCardError] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const cartItemCount = basket.reduce(
    (total, item) => total + (item.quantity || 1),
    0,
  );

  const subtotal = basket.reduce(
    (total, item) => total + item.price * (item.quantity || 1),
    0,
  );

  const handleChange = (e) => {
    // console.log(e);
    e?.error?.message ? setCardError(e?.error?.message) : setCardError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPaymentError("");

    if (!stripe || !elements) {
      setPaymentError("Stripe is still loading. Please try again in a moment.");
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setPaymentError(
        "Card details are unavailable. Please reload and try again.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axiosInstance.post("/payments/create", {
        amount: Math.round(subtotal * 100),
      });
      const clientSecret = response.data?.clientSecret;
      if (!clientSecret) {
        throw new Error("The server did not return a Stripe client secret.");
      }

      const confirmation = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: { email: user?.email || undefined },
        },
      });

      if (confirmation.error) {
        setPaymentError(
          confirmation.error.message ||
            "Stripe could not confirm this payment.",
        );
        return;
      }

      const paymentIntent = confirmation.paymentIntent;
      if (paymentIntent?.status !== "succeeded") {
        setPaymentError(
          `Payment status: ${paymentIntent?.status || "unknown"}. Please contact support before trying again.`,
        );
        return;
      }

      if (!user?.uid) throw new Error("Sign in before placing an order.");

      await db
        .collection("users")
        .doc(user.uid)
        .collection("orders")
        .doc(paymentIntent.id)
        .set({
          basket,
          amount: paymentIntent.amount,
          created: paymentIntent.created,
        });

      dispatch({ type: Type.EMPYT_BASKET });

      setPaymentComplete(true);
      navigate("/orders", { state: { msg: "You have placed new order" } });
    } catch (error) {
      const status = error.response?.status;
      setPaymentError(
        error.response?.data?.message ||
          (status === 404
            ? "Stripe could not find the payment. Check that the frontend publishable key and Functions secret key belong to the same Stripe test account."
            : error.message || "Payment failed. Please try again."),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      {/* Header */}
      <div className={classes.payment_header}>
        <span>Secure checkout</span>
        <h1>Review your order</h1>
        <p>
          {cartItemCount} {cartItemCount === 1 ? "item" : "items"} in your
          basket
        </p>
      </div>

      {/* payment method */}
      <section className={classes.payment}>
        {/* adress */}
        <div className={`${classes.flex} ${classes.delivery}`}>
          <div className={classes.section_heading}>
            <span className={classes.step}>1</span>
            <h2>Delivery address</h2>
          </div>
          <div className={classes.address_details}>
            <strong>{user?.email || "Signed-in customer"}</strong>
            <span>123 A.A Tower</span>
            <span>Flamingo, IT</span>
          </div>
        </div>

        {/* product */}
        <div className={`${classes.flex} ${classes.review}`}>
          <div className={classes.section_heading}>
            <span className={classes.step}>2</span>
            <h2>Review items</h2>
          </div>
          <div className={classes.items}>
            {basket.map((item) => (
              <ProductCard key={item.id} product={item} flex={true} />
            ))}
          </div>
        </div>
        {/* card form  */}
        <div className={`${classes.flex} ${classes.payments}`}>
          <div className={classes.section_heading}>
            <span className={classes.step}>3</span>
            <h2>Payment method</h2>
          </div>
          <div className={classes.payment_card_container}>
            <form className={classes.payment_form} onSubmit={handleSubmit}>
              <p className={classes.card_hint}>Card details</p>
              {/* card error */}
              {cardError && (
                <small className={classes.card_error}>{cardError}</small>
              )}

              {/* card element */}
              <CardElement onChange={handleChange} />

              {/* price */}
              <div className={classes.order_total}>
                <span>Total order</span>
                <strong>
                  <CurrencyFormat amount={subtotal} />
                </strong>
              </div>

              {paymentComplete && (
                <p className={classes.payment_success} role="status">
                  Payment successful. Find it in your Stripe test dashboard
                  under Transactions.
                </p>
              )}
              <button
                className={classes.pay_button}
                type="submit"
                disabled={
                  !basket.length || !stripe || isSubmitting || paymentComplete
                }
              >
                {isSubmitting
                  ? "Processing payment…"
                  : paymentComplete
                    ? "Payment complete"
                    : "Pay now"}
              </button>
              <p className={classes.secure_note}>
                Your payment details are encrypted and secure.
              </p>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default Payment;
