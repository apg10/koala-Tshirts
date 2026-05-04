// src/pages/__tests__/Checkout.test.jsx
import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
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

// Reusable mock functions for Stripe
const mockConfirmCardPayment = jest.fn();
const mockGetElement = jest.fn();
const mockNavigate = jest.fn();

jest.mock("@stripe/react-stripe-js", () => ({
  Elements: ({ children }) => <>{children}</>,
  CardElement: () => <div data-testid="card-element" />,
  useStripe: () => ({ confirmCardPayment: mockConfirmCardPayment }),
  useElements: () => ({ getElement: mockGetElement }),
}));

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
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

function renderCheckout({ user, cartItems, clearCart }) {
  useAuth.mockReturnValue({ user });
  useCart.mockReturnValue({
    cartItems,
    clearCart: clearCart || jest.fn(),
  });

  return render(
    <Checkout />
  );
}

describe("Checkout summary loading", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetElement.mockReturnValue("mock-card-element");
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

  test("submits checkout with secure endpoint /orders/checkout and not legacy endpoint", async () => {
    api.get.mockResolvedValue({ data: mockSummary });
    api.post.mockResolvedValue({ data: { client_secret: "pi_mock_secret" } });

    renderCheckout({
      user: { email: "user@example.com", is_admin: false },
      cartItems: [{ product_id: 1, qty: 2 }],
    });

    await waitFor(() => {
      expect(screen.getByText("Pay $32.98")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Pay $32.98"));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/orders/checkout", {});
    });

    expect(api.post).not.toHaveBeenCalledWith(
      "/checkout/create-payment-intent",
      expect.anything()
    );
  });

  test("uses client_secret from /orders/checkout to confirm Stripe payment", async () => {
    api.get.mockResolvedValue({ data: mockSummary });
    const mockClientSecret = "pi_secure_secret";
    const mockOrderId = 123;
    api.post.mockResolvedValue({ 
      data: { 
        client_secret: mockClientSecret, 
        order_id: mockOrderId,
        total: 32.98
      } 
    });

    // Set up the mock to resolve successfully
    mockConfirmCardPayment.mockResolvedValue({ 
      paymentIntent: { status: "succeeded" } 
    });

    renderCheckout({
      user: { email: "user@example.com", is_admin: false },
      cartItems: [{ product_id: 1, qty: 2 }],
    });

    await waitFor(() => {
      expect(screen.getByText("Pay $32.98")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Pay $32.98"));

    // Wait for the API call to /orders/checkout
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/orders/checkout", {});
    });

    // Verify confirmCardPayment was called with the correct client_secret
    await waitFor(() => {
      expect(mockConfirmCardPayment).toHaveBeenCalledWith(mockClientSecret, expect.anything());
    });

    // Verify that the legacy endpoint is not called
    expect(api.post).not.toHaveBeenCalledWith(
      "/checkout/create-payment-intent",
      expect.anything()
    );
  });
});

describe("Stripe error handling", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetElement.mockReturnValue("mock-card-element");
  });

  test("shows Stripe error when confirmCardPayment returns an error", async () => {
    // Mock checkout summary loading successfully
    api.get.mockResolvedValue({ data: mockSummary });
    
    // Mock api.post("/orders/checkout", {}) returning with client_secret
    api.post.mockResolvedValue({ 
      data: { 
        client_secret: "pi_secure_secret", 
        order_id: 123, 
        total: 32.98 
      } 
    });

    // Mock mockConfirmCardPayment resolving with Stripe error
    mockConfirmCardPayment.mockResolvedValue({ 
      error: { message: "Your card was declined." } 
    });

    renderCheckout({
      user: { email: "user@example.com", is_admin: false },
      cartItems: [{ product_id: 1, qty: 2 }],
    });

    await waitFor(() => {
      expect(screen.getByText("Pay $32.98")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Pay $32.98"));

    // Assert mockConfirmCardPayment was called with "pi_secure_secret"
    await waitFor(() => {
      expect(mockConfirmCardPayment).toHaveBeenCalledWith("pi_secure_secret", expect.anything());
    });

    // Assert the UI shows the Stripe error message
    await waitFor(() => {
      expect(screen.getByText("Your card was declined.")).toBeInTheDocument();
    });
  });

  test("shows error when checkout response is missing client_secret", async () => {
    // Mock api.get summary successfully
    api.get.mockResolvedValue({ data: mockSummary });
    
    // Mock api.post("/orders/checkout", {}) returning { order_id: 123, total: 32.98 } with no client_secret
    api.post.mockResolvedValue({ 
      data: { 
        order_id: 123, 
        total: 32.98 
      } 
    });

    renderCheckout({
      user: { email: "user@example.com", is_admin: false },
      cartItems: [{ product_id: 1, qty: 2 }],
    });

    await waitFor(() => {
      expect(screen.getByText("Pay $32.98")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Pay $32.98"));

    // Assert the UI shows "Payment processing failed. Please try again."
    await waitFor(() => {
      expect(screen.getByText("Payment processing failed. Please try again.")).toBeInTheDocument();
    });

    // Assert mockConfirmCardPayment is not called
    expect(mockConfirmCardPayment).not.toHaveBeenCalled();
  });

  test("successful guest checkout clears cart and navigates to confirmation", async () => {
    // Mock checkout summary loading successfully for guest checkout
    api.post
      .mockResolvedValueOnce({ data: mockSummary })
      .mockResolvedValueOnce({ 
        data: { 
          client_secret: "pi_guest_secret", 
          order_id: 456, 
          total: 32.98 
        } 
      });

    // Mock mockConfirmCardPayment resolving with success
    mockConfirmCardPayment.mockResolvedValue({ 
      paymentIntent: { status: "succeeded" } 
    });

    const mockClearCart = jest.fn();

    renderCheckout({
      user: null,
      cartItems: [{ product_id: 1, qty: 2 }],
      clearCart: mockClearCart
    });

    // Wait for the guest shipping fields to render before filling
    await screen.findByLabelText("Full Name");

    // Fill guest shipping fields
    fireEvent.change(screen.getByLabelText("Full Name"), { target: { value: "Guest User" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "guest@example.com" } });
    fireEvent.change(screen.getByLabelText("Address"), { target: { value: "123 Guest St" } });

    fireEvent.click(screen.getByText("Pay $32.98"));

    // Assert api.post was called with "/checkout/summary" and normalized items
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/checkout/summary", {
        items: [{ product_id: 1, qty: 2 }]
      });
    });

    // Assert api.post was called with "/orders/checkout" and correct payload
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/orders/checkout", {
        shipping: {
          name: "Guest User",
          email: "guest@example.com",
          address: "123 Guest St"
        },
        items: [{ product_id: 1, qty: 2 }]
      });
    });

    // Assert mockConfirmCardPayment was called with "pi_guest_secret"
    await waitFor(() => {
      expect(mockConfirmCardPayment).toHaveBeenCalledWith("pi_guest_secret", expect.anything());
    });

    // Assert clearCart was called
    await waitFor(() => {
      expect(mockClearCart).toHaveBeenCalled();
    });

    // Assert mockNavigate was called with "/confirmation"
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/confirmation");
    });
  });

  test("successful authenticated checkout navigates without clearing cart locally", async () => {
    // Mock api.get("/checkout/summary") successfully
    api.get.mockResolvedValue({ data: mockSummary });
    
    // Mock api.post("/orders/checkout", {}) returning with client_secret
    api.post.mockResolvedValue({ 
      data: { 
        client_secret: "pi_auth_secret", 
        order_id: 789, 
        total: 32.98 
      } 
    });

    // Mock mockConfirmCardPayment resolving
    mockConfirmCardPayment.mockResolvedValue({ 
      paymentIntent: { status: "succeeded" } 
    });

    const mockClearCart = jest.fn();

    renderCheckout({
      user: { email: "user@example.com", is_admin: false },
      cartItems: [{ product_id: 1, qty: 2 }],
      clearCart: mockClearCart
    });

    // Wait for the Pay button to be available
    const payButton = await screen.findByText("Pay $32.98");
    fireEvent.click(payButton);

    // Assert api.post was called with "/orders/checkout", {}
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/orders/checkout", {});
    });

    // Assert mockConfirmCardPayment was called with "pi_auth_secret"
    await waitFor(() => {
      expect(mockConfirmCardPayment).toHaveBeenCalledWith("pi_auth_secret", expect.anything());
    });

    // Assert clearCart was NOT called
    expect(mockClearCart).not.toHaveBeenCalled();

    // Assert mockNavigate was called with "/confirmation"
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/confirmation");
    });
  });

  test("guest checkout validation prevents submission when shipping fields are missing", async () => {
    // Mock checkout summary loading successfully for guest checkout
    api.post.mockResolvedValue({ data: mockSummary });

    const mockClearCart = jest.fn();

    renderCheckout({
      user: null,
      cartItems: [{ product_id: 1, qty: 2 }],
      clearCart: mockClearCart
    });

    // Wait for the guest shipping fields to render before filling
    await screen.findByLabelText("Full Name");

    // Leave one required shipping field blank after trimming
    fireEvent.change(screen.getByLabelText("Full Name"), { target: { value: "Guest User" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "guest@example.com" } });
    fireEvent.change(screen.getByLabelText("Address"), { target: { value: "   " } });

    fireEvent.click(screen.getByText("Pay $32.98"));

    // Verify that no API call was made to /orders/checkout 
    await waitFor(() => {
      expect(screen.getByText("Please fill in all shipping fields")).toBeInTheDocument();
    });

    expect(api.post).not.toHaveBeenCalledWith("/orders/checkout", expect.anything());
    
    // Verify that Stripe confirmation was not attempted
    expect(mockConfirmCardPayment).not.toHaveBeenCalled();
    
    // Verify that no navigation was attempted
    expect(mockNavigate).not.toHaveBeenCalled();
    
    // Verify that no cart clearing was attempted
    expect(mockClearCart).not.toHaveBeenCalled();
  });
});
