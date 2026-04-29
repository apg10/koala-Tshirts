// src/pages/Checkout.jsx
import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

// Carga tu clave pública de Stripe desde .env
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

/* ────────────── Formulario interno ────────────── */
function CheckoutForm({ summary, cartItems }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const { user } = useAuth();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    email: "",
    address: "",
  });

  // Handle changes to shipping info
  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;          // Stripe aún no listo
    setProcessing(true);
    setError(null);

    try {
      let payload = {};
      
      if (!user) {
        if (
          !shippingInfo.name.trim() ||
          !shippingInfo.email.trim() ||
          !shippingInfo.address.trim()
        ) {
          throw new Error("Please fill in all shipping fields");
        }
        
        if (cartItems.length === 0) {
          throw new Error("Cart is empty");
        }
        
        payload = {
          shipping: {
            name: shippingInfo.name.trim(),
            email: shippingInfo.email.trim(),
            address: shippingInfo.address.trim(),
          },
          items: cartItems.map(item => ({
            product_id: item.product_id,
            qty: item.qty
          }))
        };
      }
      
      /* 1. Crear order y PaymentIntent en backend */
      const { data } = await api.post("/orders/checkout", payload);
      
      // Verificar client_secret en la respuesta
      if (!data.client_secret) {
        throw new Error("Payment processing failed. Please try again.");
      }
      const clientSecret = data.client_secret;

      /* 2. Confirmar pago con Stripe.js */
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        setError(result.error.message);
        setProcessing(false);
      } else if (result.paymentIntent.status === "succeeded") {
        /* 3. Pago exitoso → limpiar carrito y redirigir */
        if (!user) {
          await clearCart();
        }
        navigate("/confirmation");
      }
    } catch (err) {
      setError(err.message || "Could not initiate checkout.");
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
      {!user && (
        <>
          <h2 className="text-2xl font-semibold">Shipping Information</h2>

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={shippingInfo.name}
                onChange={handleShippingChange}
                required={!user}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={shippingInfo.email}
                onChange={handleShippingChange}
                required={!user}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium mb-1">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={shippingInfo.address}
                onChange={handleShippingChange}
                required={!user}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
        </>
      )}

      <h2 className="text-2xl font-semibold">Payment Details</h2>

      <div className="border p-4 rounded">
        <CardElement options={{ hidePostalCode: true }} />
      </div>

      {error && <p className="text-red-600 text-center">{error}</p>}

      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-primary text-white py-3 rounded disabled:opacity-50"
      >
        {processing ? "Processing…" : `Pay $${summary.total.toFixed(2)}`}
      </button>
    </form>
  );
}

/* ────────────── Página Checkout ────────────── */
export default function Checkout() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { cartItems } = useCart();
  const { user } = useAuth();

  /* Obtener resumen de compra al montar */
  useEffect(() => {
    let cancelled = false;

    const loadSummary = async () => {
      setLoading(true);
      setError(null);

      try {
        let res;

        if (user) {
          res = await api.get("/checkout/summary");
        } else {
          if (cartItems.length === 0) {
            if (!cancelled) {
              setSummary(null);
              setError("Cart is empty");
            }
            return;
          }

          res = await api.post("/checkout/summary", {
            items: cartItems.map(item => ({
              product_id: item.product_id,
              qty: item.qty
            }))
          });
        }

        if (!cancelled) {
          setSummary(res.data);
        }
      } catch {
        if (!cancelled) {
          setSummary(null);
          setError("Could not load checkout summary.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadSummary();

    return () => {
      cancelled = true;
    };
  }, [user, cartItems]);

  if (loading) {
    return <p className="p-8 text-center">Loading checkout…</p>;
  }
  if (error) {
    return (
      <section className="max-w-2xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-4">Checkout</h1>
        <p className="text-red-600">{error}</p>
      </section>
    );
  }

  return (
    <section className="max-w-2xl mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-bold">Checkout</h1>

      {/* Resumen de la compra */}
      <div className="border rounded p-4 space-y-2">
        {summary.items.map((it) => (
          <div key={it.product_id} className="flex justify-between">
            <span>
              {it.name} × {it.quantity}
            </span>
            <span>${(it.price * it.quantity).toFixed(2)}</span>
          </div>
        ))}
        <hr />
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${summary.subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax</span>
          <span>${summary.tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>${summary.total.toFixed(2)}</span>
        </div>
      </div>

      {/* Formulario de pago */}
      <Elements stripe={stripePromise}>
        <CheckoutForm summary={summary} cartItems={cartItems} />
      </Elements>
    </section>
  );
}
