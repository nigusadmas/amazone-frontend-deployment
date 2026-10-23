import React, { useState } from "react";
import { HiOutlineMenu } from "react-icons/hi";
import { Link } from "react-router-dom";
import { CategoryInfos } from "../Catagory/CategoriesFullInfos";

import classes from "./LowerHeader.module.css";

const LowerHeader = () => {
  const [showCategories, setShowCategories] = useState(false);
  return (
    <nav className={classes.lower_header}>
      <ul>
        <li className={classes.all_menu}>
          <button type="button" aria-expanded={showCategories} onClick={() => setShowCategories((open) => !open)}>
          <HiOutlineMenu size={22} />
          <span>All</span>
          </button>
        </li>
        <li><Link to="/deals">Today's Deals</Link></li>
        <li><Link to="/gift-cards">Gift Cards</Link></li>
        <li><Link to="/sell">Sell</Link></li>
        <li><Link to="/registry">Registry</Link></li>
        <li><Link to="/prime-video">Prime Video</Link></li>
        <li><Link to="/customer-service">Customer Service</Link></li>
      </ul>
      {showCategories && <div className={classes.categoryMenu}>
        <strong>Shop by category</strong>
        {CategoryInfos.map((item) => <Link key={item.name} to={`/category/${encodeURIComponent(item.name)}`} onClick={() => setShowCategories(false)}>{item.title}</Link>)}
      </div>}
    </nav>
  );
};

export default LowerHeader;
