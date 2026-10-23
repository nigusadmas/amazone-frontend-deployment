import React from "react";
import Header from "../Headers/Header";

function Layout({ children }) {
  return (
    <div>
      <Header />

      {children}
    </div>
  );
}

export default Layout;
