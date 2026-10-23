import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "../../Components/Layout/Layout";
import ProductCard from "../../Components/Product/ProductCard";
import { productURl } from "../../Api/Api";
import classes from "./Results.module.css";

function Search() {
  const [params] = useSearchParams();
  const query = params.get("q")?.trim().toLowerCase() || "";
  const category = params.get("category") || "all";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    const endpoint = category === "all"
      ? `${productURl}/products`
      : `${productURl}/products/category/${encodeURIComponent(category)}`;
    fetch(endpoint)
      .then((response) => {
        if (!response.ok) throw new Error("Could not load products.");
        return response.json();
      })
      .then((items) => { if (active) setProducts(items); })
      .catch((loadError) => { if (active) setError(loadError.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [category]);

  const results = products.filter((product) =>
    `${product.title} ${product.description} ${product.category}`.toLowerCase().includes(query),
  );

  return <Layout>
    <section>
      <p style={{ padding: "26px 24px 0" }}>Search / {query || "All products"}</p>
      <div className={classes.product_container}>
        {loading && <p>Loading products…</p>}
        {!loading && error && <p role="alert">{error}</p>}
        {!loading && !error && results.length === 0 && <p>No products match your search.</p>}
        {!loading && !error && results.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>
    </section>
  </Layout>;
}

export default Search;
