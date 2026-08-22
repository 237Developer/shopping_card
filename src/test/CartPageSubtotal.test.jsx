import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, Outlet, RouterProvider } from "react-router";
import { expect, test } from "vitest";
import CartPage from "../pages/CartPage";

const product = {
  id: 1,
  title: "Test product",
  price: 10,
  image: "https://example.com/product.jpg",
};

function CartPageLayout() {
  const [cartArticles, setCartArticles] = useState([{ id: 1, count: 2 }]);

  return (
    <Outlet
      context={{
        data: [product],
        cartArticles,
        setCartArticles,
      }}
    />
  );
}

function renderCartPage() {
  const router = createMemoryRouter(
    [
      {
        path: "/",
        element: <CartPageLayout />,
        children: [{ index: true, element: <CartPage /> }],
      },
    ],
    { initialEntries: ["/"] },
  );

  render(<RouterProvider router={router} />);
}

test("updates the displayed subtotal when the cart quantity changes", async () => {
  const user = userEvent.setup();

  renderCartPage();

  expect(screen.getByText("4000 FCFA")).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "+" }));
  await user.click(screen.getByRole("button", { name: "+" }));
  expect(screen.getByText("8000 FCFA")).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "–" }));
  await user.click(screen.getByRole("button", { name: "–" }));
  expect(screen.getByText("4000 FCFA")).toBeInTheDocument();
});
