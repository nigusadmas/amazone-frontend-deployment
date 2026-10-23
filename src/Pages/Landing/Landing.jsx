import React from "react";
import CarouselEffect from "../../Components/Carousel/CarouselEffect";
import Catagory from "../../Components/Catagory/Catagory";
import Product from "../../Components/Product/Product";
import Layout from "../../Components/Layout/Layout";

function Landing() {
  return (
    <Layout>
      <CarouselEffect />
      <Catagory />
      <Product />
    </Layout>
  );
}

export default Landing;
