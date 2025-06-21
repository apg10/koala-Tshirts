// src/pages/Checkout.jsx
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";
import GuestForm from "../components/GuestForm";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

export default function Checkout() {
  const { cartItems, total, clearCart } = useCart();
  const { user }                        = useAuth();
  const navigate                         = useNavigate();

  const [shippingInfo, setShippingInfo] = useState(null);
  const [error, setError]               = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const stripePromise                   = loadStripe(
    import.meta.env.VITE_STRIPE_PUBLIC_KEY
  );

  const initCheckout = async (body) => {
    console.log("→ [Checkout] initCheckout body:", body);
    try {
      const res = await apiClient.post("/orders/checkout", body);
      console.log("→ [Checkout] response data:", res.data);
      setClientSecret(res.data.stripe_pi_id);
    } catch (err) {
      console.error("❌ Checkout init error:", err);
      setError("Could not initiate checkout.");
    }
  };

  // Si el usuario ya está logueado, iniciamos checkout vacío
  useEffect(() => {
    if (user && cartItems.length > 0) {
      initCheckout({});
    }
  }, [user, cartItems]);

  // Envío del formulario de invitado
  const handleGuestSubmit = (shipping) => {
    setShippingInfo(shipping);
    const items = cartItems.map((i) => ({
      product_id: i.id,
      qty:        i.qty,
    }));
    initCheckout({ shipping, items });
  };

  return (
    <section className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {cartItems.length === 0 && <p>Your cart is empty.</p>}

      {/* Paso 1: si no hay user ni shippingInfo → form de invitado */}
      {!user && !shippingInfo && cartItems.length > 0 && (
        <GuestForm onSubmit={handleGuestSubmit} />
      )}

      {error && <p className="text-red-500">{error}</p>}

      {/* Paso 2: cuando tengamos el clientSecret → Stripe Elements */}
      {clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <StripeForm clearCart={clearCart} navigate={navigate} />
        </Elements>
      )}
    </section>
  );
}

function StripeForm({ clearCart, navigate }) {
  const stripe   = useStripe();
  const elements = useElements();
  const [payError, setPayError] = useState("");
  const [loading, setLoading]   = useState(false);

  const handlePay = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);

    const card = elements.getElement(CardElement);
    const { error } = await stripe.confirmCardPayment(
      // el clientSecret ya está en el contexto de Elements
      { payment_method: { card } }
    );

    if (error) {
      setPayError(error.message);
    } else {
      clearCart();
      navigate("/confirmation");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handlePay} className="space-y-4">
      <CardElement className="p-4 border rounded" />
      {payError && <p className="text-red-500">{payError}</p>}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        {loading ? "Processing…" : "Pay Now"}
      </button>
    </form>
  );
}
