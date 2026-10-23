import React, { useContext, useState } from "react";
import { SlLocationPin } from "react-icons/sl";
import { BsSearch } from "react-icons/bs";
import { BiCart } from "react-icons/bi";
import { auth } from "../../Utility/firebase";
import { Link, useNavigate } from "react-router-dom";

import classes from "./Header.module.css";
import { DataContext } from "../DataProvider/DataProvider";
import LowerHeader from "../../Components/Headers/LowerHeader";
import { CategoryInfos } from "../Catagory/CategoriesFullInfos";

const Header = () => {
  const [{ user, basket = [] }] = useContext(DataContext);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const navigate = useNavigate();
  const cartItemCount = basket.reduce(
    (total, item) => total + (item.quantity || 1),
    0,
  );

  const searchProducts = (event) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (category !== "all") params.set("category", category);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <section className={classes.fixed}>
      <header className={classes.header_container}>
        {/* Logo + Delivery */}
        <div className={classes.logo_container}>
          <Link to="/">
            <img
              src="https://pngimg.com/uploads/amazon/small/amazon_PNG11.png"
              alt="Amazon Logo"
            />
          </Link>

          <Link to="/delivery" className={classes.Delivery_location}>
            <SlLocationPin />
            <div>
              <p>Deliver to</p>
              <span>{localStorage.getItem("deliveryCountry") || "Ethiopia"}</span>
            </div>
          </Link>
        </div>

        {/* Search */}
        <form className={classes.search} onSubmit={searchProducts} role="search">
          <select aria-label="Search category" value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="all">All</option>
            {CategoryInfos.map((item) => <option key={item.name} value={item.name}>{item.title}</option>)}
          </select>
          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search Amazon" aria-label="Search products" />
          <button type="submit" aria-label="Submit search"><BsSearch /></button>
        </form>

        {/* Language */}
        <div className={classes.language}>
          <img
            src="https://pngimg.com/uploads/flags/small/flags_PNG14592.png"
            alt="USA Flag"
          />

          <select>
            <option>EN</option>
          </select>
        </div>

        {/* Account */}
        <Link to={user ? "/account" : "/auth"} className={classes.nav_item}>
          <div>
            {user ? (
              <>
                <p>Hello , {user?.email?.split("@")[0]}</p>

                <span onClick={(event) => { event.preventDefault(); auth.signOut(); }}>
                  <b style={{ color: "red", paddingTop: "10px" }}>SignOut</b>
                </span>
              </>
            ) : (
              <>
                <p>Hello, Sign in</p>
                <span>Account & Lists</span>
              </>
            )}
          </div>
        </Link>

        {/* Orders */}
        <Link to="/orders" className={classes.nav_item}>
          <p>Returns</p>
          <span>& Orders</span>
        </Link>

        {/* Cart */}
        <Link to="/carts" className={classes.cart}>
          <BiCart />
          <span>{cartItemCount}</span>
          <p>Cart</p>
        </Link>
      </header>
      <LowerHeader />
    </section>
  );
};

export default Header;
