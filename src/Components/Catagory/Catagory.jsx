import React from "react";
import { CategoryInfos } from "./CategoriesFullInfos.js";
import CatagoryCard from "./CatagoryCard";

import "./Category.css";

const Catagory = () => {
  return (
    <section className="category-section">
      {CategoryInfos.map((infos, index) => (
        <CatagoryCard key={index} data={infos} />
      ))}
    </section>
  );
};

export default Catagory;
