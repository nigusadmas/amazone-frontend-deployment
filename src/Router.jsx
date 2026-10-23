import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./Pages/Landing/Landing";
import Payment from "./Pages/Payments/Payment";
import Order from "./Pages/Orders/Order";
import Cart from "./Pages/Cart/Cart";
import Result from "./Pages/Results/Result";
import ProductDetails from "../src/Pages/ProductDetails/ProductDetails";
import Auth from "./Pages/Auth/Auth";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import Search from "./Pages/Results/Search";
import InfoPage from "./Pages/InfoPage";
import Delivery from "./Pages/Delivery";

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripePublishableKey
  ? loadStripe(stripePublishableKey)
  : null;

function Routing() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/search" element={<Search />} />
        <Route path="/delivery" element={<Delivery />} />
        <Route path="/account" element={<ProtectedRoute msg="Please sign in to view your account" redirect="/account"><InfoPage /></ProtectedRoute>} />
        <Route path="/:page" element={<InfoPage />} />
        <Route
          path="/payment"
          element={
            <ProtectedRoute msg={"You must login to pay"} redirect={"/payment"}>
              {stripePromise ? (
                <Elements stripe={stripePromise}>
                  <Payment />
                </Elements>
              ) : (
                <Payment stripeConfigMissing />
              )}
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute
              msg={"You must login to see your Orders"}
              redirect={"/orders"}
            >
              <Elements stripe={stripePromise}>
                <Order />
              </Elements>
            </ProtectedRoute>
          }
        />
        <Route path="/category/:categoryName" element={<Result />} />
        <Route path="/products/:productId" element={<ProductDetails />} />
        <Route path="/carts" element={<Cart />} />
      </Routes>
    </Router>
  );
}

export default Routing;
