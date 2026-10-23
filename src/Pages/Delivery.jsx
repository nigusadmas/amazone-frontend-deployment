import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../Components/Layout/Layout";
import classes from "./InfoPage.module.css";

function Delivery() {
  const navigate = useNavigate();
  const [country, setCountry] = useState(
    () => localStorage.getItem("deliveryCountry") || "Ethiopia",
  );

  const saveDestination = (event) => {
    event.preventDefault();
    localStorage.setItem("deliveryCountry", country);
    navigate(-1);
  };

  return (
    <Layout>
      <main className={classes.panel}>
        <p className={classes.eyebrow}>Shipping preferences</p>
        <h1>Choose your delivery location</h1>
        <p>We’ll use this destination to show relevant delivery information.</p>
        <form className={classes.deliveryForm} onSubmit={saveDestination}>
          <label htmlFor="delivery-country">Deliver to</label>
          <select id="delivery-country" value={country} onChange={(event) => setCountry(event.target.value)}>
            {["Ethiopia", "United States", "United Kingdom", "Canada", "Australia", "Germany", "France", "India"].map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
          <button type="submit">Save destination</button>
        </form>
      </main>
    </Layout>
  );
}

export default Delivery;
