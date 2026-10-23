import React from "react";
import { Link } from "react-router-dom";

const CatagoryCard = ({ data }) => {
  if (!data) return null; // ✅ prevents crash
  return (
    <div>
      <Link to={`/category/${data.name}`} className="category-card">
        <h2>{data.title}</h2>
        <img src={data.imgLink} alt={data.title} />
        <p>{data.disc}</p>
        <p>shop now</p>
      </Link>
    </div>
  );
};

export default CatagoryCard;
