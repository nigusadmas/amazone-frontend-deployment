import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import styles from "./Product.module.css";
import Loader from "../Loader/Loader";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://fakestoreapi.com/products")
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.error("Could not load products:", err);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <section className={styles.productsContainer}>
          {products.map((singleProduct) => (
            <ProductCard product={singleProduct} key={singleProduct.id} />
          ))}
        </section>
      )}
    </div>
  );
};

export default Product;
