// src/pages/Checkout.jsx
import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { useCart } from "../context/CartContext";
import apiClient from "../api/apiClient";
import { useNavigate } from "react-router-dom";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function CheckoutForm({ clientSecret }) {
  const stripe    = useStripe();
  const elements  = useElements();
  const { clearCart } = useCart();
  const navigate  = useNavigate();
  const [error, setError]         = useState("");
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setProcessing(true);

    const { error: stripeError, paymentIntent } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });

    if (stripeError) {
      setError(stripeError.message);
      setProcessing(false);
    } else {
      clearCart();
      navigate(`/orders/${paymentIntent.id}`, {
        state: { intent: paymentIntent },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <CardElement
        options={{
          style: {
            base: {
              fontSize: "16px",
              color: "#424770",
              "::placeholder": { color: "#aab7c4" },
            },
            invalid: { color: "#9e2146" },
          },
        }}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition"
      >
        {processing ? "Processing…" : "Pay Now"}
      </button>
    </form>
  );
}

export default function Checkout() {
  const { cartItems } = useCart();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    apiClient
      .post("/orders/checkout")
      .then(({ data }) => {
        setClientSecret(data.client_secret || data.stripe_pi_client_secret);
      })
      .catch((err) => {
        console.error("Checkout init error:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <p className="page-wrapper py-8 text-center">
        Preparing your payment…
      </p>
    );
  }
  if (!clientSecret) {
    return (
      <p className="page-wrapper py-8 text-center text-red-500">
        Could not initiate checkout.
      </p>
    );
  }

  return (
    <div className="page-wrapper py-8 max-w-md">
      <h1 className="text-2xl font-semibold mb-6">Checkout</h1>
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <CheckoutForm clientSecret={clientSecret} />
      </Elements>
    </div>
  );
}
