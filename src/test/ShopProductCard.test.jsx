import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import ShopProductCard from "../composants/shopProductCard";
import { CartProvider, useCart } from "../context/CartContext";

function CartState() {
  const { cartArticles } = useCart();

  return <output data-testid="cart-state">{JSON.stringify(cartArticles)}</output>;
}

function renderShopProductCard(initialCartArticles = []) {
  render(
    <MemoryRouter>
      <CartProvider initialCartArticles={initialCartArticles}>
        <ShopProductCard
          id={1}
          img="https://example.com/product.jpg"
          title="Test product"
          price={10}
          description="A product used for testing"
        />
        <CartState />
      </CartProvider>
    </MemoryRouter>,
  );
}

test("updates the displayed quantity and adds the selected quantity to the cart", async () => {
  const user = userEvent.setup();
  renderShopProductCard();

  const decreaseButton = screen.getByRole("button", { name: "–" });
  const increaseButton = screen.getByRole("button", { name: "+" });

  expect(screen.getByText("1")).toBeInTheDocument();

  await user.click(increaseButton);
  expect(screen.getByText("2")).toBeInTheDocument();

  await user.click(decreaseButton);
  expect(screen.getByText("1")).toBeInTheDocument();

  await user.click(increaseButton);
  await user.click(increaseButton);
  expect(screen.getByText("3")).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "Ajouter au panier" }));

  expect(screen.getByTestId("cart-state").textContent).toBe(
    '[{"id":1,"count":3}]',
  );
});

test("updates an existing cart item without creating a duplicate", async () => {
  const user = userEvent.setup();
  renderShopProductCard([{ id: 1, count: 1 }]);

  const increaseButton = screen.getByRole("button", { name: "+" });
  await user.click(increaseButton);
  await user.click(increaseButton);
  await user.click(screen.getByRole("button", { name: "Ajouter au panier" }));

  expect(screen.getByTestId("cart-state").textContent).toBe(
    '[{"id":1,"count":3}]',
  );
});
