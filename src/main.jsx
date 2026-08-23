import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import routes from "./routes/route";
import "./index.css";
import { CartProvider } from "./context/CartContext";

const router = createBrowserRouter(routes);

createRoot(document.getElementById("root")).render(
  <CartProvider>
    <RouterProvider router={router} />
  </CartProvider>,
);
