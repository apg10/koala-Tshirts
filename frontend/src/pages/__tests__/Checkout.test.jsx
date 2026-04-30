// src/pages/__tests__/Checkout.test.jsx
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Checkout from "../Checkout";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

jest.mock("../../api/axios", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

jest.mock("../../context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("../../context/CartContext", () => ({
  useCart: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  useNavigate: () => jest.fn(),
}));

jest.mock("../../config/env", () => ({
  STRIPE_PUBLISHABLE_KEY: "pk_test_mock",
}));

jest.mock("@stripe/stripe-js", () => ({
  loadStripe: jest.fn(() => Promise.resolve({})),
}));

jest.mock("@stripe/react-stripe-js", () => ({
  Elements: ({ children }) => <>{children}</>,
  CardElement: () => <div data-testid="card-element" />,
  useStripe: () => ({ confirmCardPayment: jest.fn() }),
  useElements: () => ({ getElement: jest.fn() }),
}));

const mockSummary = {
  items: [
    {
      product_id: 1,
      name: "Test Product",
      price: 29.99,
      quantity: 1,
      total: 29.99,
    },
  ],
  subtotal: 29.99,
  tax: 2.99,
  total: 32.98,
};

function renderCheckout({ user, cartItems }) {
  useAuth.mockReturnValue({ user });
  useCart.mockReturnValue({
    cartItems,
    clearCart: jest.fn(),
  });

  return render(
    <Checkout />
  );
}

describe("Checkout summary loading", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("loads summary for authenticated users with GET /checkout/summary", async () => {
    api.get.mockResolvedValue({ data: mockSummary });

    renderCheckout({
      user: { email: "user@example.com", is_admin: false },
      cartItems: [{ product_id: 1, qty: 2 }],
    });

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith("/checkout/summary");
    });

    expect(api.post).not.toHaveBeenCalled();
    expect((await screen.findAllByText("$32.98")).length).toBeGreaterThan(0);
  });

  test("loads summary for guest users with POST /checkout/summary", async () => {
    api.post.mockResolvedValue({ data: mockSummary });

    renderCheckout({
      user: null,
      cartItems: [
        { product_id: 1, qty: 2, price: 0.01 },
        { product_id: 2, qty: 1, name: "Ignored Name" },
      ],
    });

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/checkout/summary", {
        items: [
          { product_id: 1, qty: 2 },
          { product_id: 2, qty: 1 },
        ],
      });
    });

    expect(api.get).not.toHaveBeenCalled();
    expect((await screen.findAllByText("$32.98")).length).toBeGreaterThan(0);
  });

  test("shows an error and avoids API calls for guest users with an empty cart", async () => {
    renderCheckout({
      user: null,
      cartItems: [],
    });

    expect(await screen.findByText("Cart is empty")).toBeInTheDocument();
    expect(api.get).not.toHaveBeenCalled();
    expect(api.post).not.toHaveBeenCalled();
  });
});
