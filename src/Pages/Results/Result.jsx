import React, { useEffect, useState } from "react";
import Layout from "../../Components/Layout/Layout";
import { useParams } from "react-router-dom";
import axios from "axios";

import { productURl } from "../../Api/Api";
import ProductCard from "../../Components/Product/ProductCard";
import classes from "./Results.module.css";

function Result() {
  const { categoryName } = useParams();
  const [results, setResult] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isCurrent = true;
    setLoading(true);
    setError("");

    axios
      .get(`${productURl}/products/category/${categoryName}`)
      .then((res) => {
        if (isCurrent) setResult(res.data);
      })
      .catch(() => {
        if (isCurrent) {
          setResult([]);
          setError("Could not load products. Please try again.");
        }
      })
      .finally(() => {
        if (isCurrent) setLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [categoryName]);

  return (
    <Layout>
      <section>
        <p style={{ padding: "30px" }}>Category / {categoryName}</p>
        <hr />
        <div className={classes.product_container}>
          {loading && <p>Loading products...</p>}
          {!loading && error && <p role="alert">{error}</p>}
          {!loading && !error && results.length === 0 && (
            <p>No products found.</p>
          )}
          {!loading &&
            !error &&
            results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
        </div>
      </section>
    </Layout>
  );
}

export default Result;
