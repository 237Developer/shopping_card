import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { vi } from "vitest";
import ShopProductCard from "../composants/shopProductCard";

function renderShopProductCard(setArticle) {
  render(
    <MemoryRouter>
      <ShopProductCard
        id={1}
        img="https://example.com/product.jpg"
        title="Test product"
        price={10}
        description="A product used for testing"
        setArticle={setArticle}
      />
    </MemoryRouter>,
  );
}

test("updates the displayed quantity and adds the selected quantity to the cart", async () => {
  const user = userEvent.setup();
  const setArticle = vi.fn();

  renderShopProductCard(setArticle);

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

  expect(setArticle).toHaveBeenCalledTimes(1);
  const updateCart = setArticle.mock.calls[0][0];
  expect(updateCart([])).toEqual([{ id: 1, count: 3 }]);
});

test("updates an existing cart item without creating a duplicate", async () => {
  const user = userEvent.setup();
  const setArticle = vi.fn();

  renderShopProductCard(setArticle);

  const increaseButton = screen.getByRole("button", { name: "+" });
  await user.click(increaseButton);
  await user.click(increaseButton);
  await user.click(screen.getByRole("button", { name: "Ajouter au panier" }));

  const updateCart = setArticle.mock.calls[0][0];
  expect(updateCart([{ id: 1, count: 1 }])).toEqual([{ id: 1, count: 3 }]);
});
