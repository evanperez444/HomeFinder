import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Set page title
document.title = "HomeFinder - Find Your Dream Home";

// Add meta description for SEO
const metaDescription = document.createElement('meta');
metaDescription.name = 'description';
metaDescription.content = 'Search through thousands of real estate listings to find your perfect home. HomeFinder offers a simple and easy-to-use interface for buyers, renters, and sellers.';
document.head.appendChild(metaDescription);

createRoot(document.getElementById("root")!).render(<App />);
