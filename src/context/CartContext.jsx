/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useReducer } from "react";

const CartContext = createContext();

export const CART_ACTIONS = {
  ADD_ARTICLE: "ADD_ARTICLE",
  INCREASE_QUANTITY: "INCREASE_QUANTITY",
  DECREASE_QUANTITY: "DECREASE_QUANTITY",
  REMOVE_ARTICLE: "REMOVE_ARTICLE",
};

function cartReducer(cartArticles, action) {
  switch (action.type) {
    case CART_ACTIONS.ADD_ARTICLE: {
      const existingArticle = cartArticles.find(
        (article) => article.id === action.payload.id,
      );

      if (existingArticle) {
        return cartArticles.map((article) =>
          article.id === action.payload.id
            ? { ...article, count: action.payload.count }
            : article,
        );
      }

      return [...cartArticles, action.payload];
    }

    case CART_ACTIONS.INCREASE_QUANTITY:
      return cartArticles.map((article) =>
        article.id === action.payload.id
          ? { ...article, count: article.count + 1 }
          : article,
      );

    case CART_ACTIONS.DECREASE_QUANTITY:
      return cartArticles.map((article) =>
        article.id === action.payload.id
          ? { ...article, count: article.count - 1 }
          : article,
      );

    case CART_ACTIONS.REMOVE_ARTICLE:
      return cartArticles.filter((article) => article.id !== action.payload.id);

    default:
      return cartArticles;
  }
}

export function CartProvider({ children, initialCartArticles = [] }) {
  const [cartArticles, dispatch] = useReducer(
    cartReducer,
    initialCartArticles,
  );

  return (
    <CartContext.Provider value={{ cartArticles, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}
