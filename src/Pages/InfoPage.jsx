import { Link, useParams } from "react-router-dom";
import Layout from "../Components/Layout/Layout";
import classes from "./InfoPage.module.css";

const content = {
  deals: ["Today's Deals", "Explore products across our catalog and find something you love."],
  "gift-cards": ["Gift Cards", "A thoughtful gift for birthdays, celebrations, and everyday surprises."],
  sell: ["Sell with us", "This demo storefront is ready to showcase products. Seller tools are coming soon."],
  registry: ["Your Registry", "Create a list of favorite products to share with friends and family."],
  "prime-video": ["Prime Video", "Discover entertainment alongside your favorite shopping experience."],
  "customer-service": ["Customer Service", "Need help? Browse your orders or contact our support team."],
  account: ["Your Account", "Manage your account and review your recent purchases."],
};

function InfoPage() {
  const { page = "deals" } = useParams();
  const [title, description] = content[page] || content.deals;
  return <Layout><main className={classes.panel}>
    <p className={classes.eyebrow}>Amazon marketplace</p>
    <h1>{title}</h1>
    <p>{description}</p>
    <div className={classes.actions}>
      <Link to="/">Continue shopping</Link>
      <Link to="/orders">View your orders</Link>
    </div>
  </main></Layout>;
}

export default InfoPage;
