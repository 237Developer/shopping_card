import { Children } from "react";
import App from "../App";
import HomePage from "../pages/HomePage";
import ShopPage from "../pages/ShopPage";
import CartPage from "../pages/CartPage";

const routes = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "/shop",
        element: <ShopPage />,
      },
      {
        path: "/cart",
        element: <CartPage />,
      },
    ],
  },
];

export default routes;
