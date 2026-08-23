import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import CartCard from "../composants/cartCard";
import { test, expect } from "vitest";
import { CartProvider, useCart } from "../context/CartContext";

function CartCardContent() {
  const { cartArticles } = useCart();
  const cartQty = cartArticles.find((article) => article.id === 1).count;

  return (
    <CartCard
      id={1}
      img="https://example.com/product.jpg"
      title="Test product"
      price={10}
      description="A product used for testing"
      cartQty={cartQty}
    />
  );
}

function CartCardWithState() {
  return (
    <CartProvider initialCartArticles={[{ id: 1, count: 11 }]}>
      <CartCardContent />
    </CartProvider>
  );
}

function renderCartCard() {
  render(
    <MemoryRouter>
      <CartCardWithState />
    </MemoryRouter>,
  );
}

test("updates the displayed quantity to the cart in the cartPage", async () => {
  const user = userEvent.setup();
  renderCartCard();
  const decreaseButton = screen.getByRole("button", { name: "–" });
  const increaseButton = screen.getByRole("button", { name: "+" });
  const qty = screen.getByTestId("test-qty");

  expect(qty.textContent).toBe("11");

  await user.click(increaseButton);
  await user.click(increaseButton);

  expect(qty.textContent).toBe("13");

  await user.click(decreaseButton);
  expect(qty.textContent).toBe("12");
});
