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

// Carga tu clave pública de Stripe desde .env
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

/* ────────────── Formulario interno ────────────── */
function CheckoutForm({ summary }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;          // Stripe aún no listo
    setProcessing(true);
    setError(null);

    try {
      /* 1. Crear PaymentIntent en backend */
      const { data } = await api.post("/checkout/create-payment-intent", {
        amount: summary.total,
      });
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
        /* 3. Pago exitoso → redirigir */
        navigate("/confirmation");
      }
    } catch {
      setError("Could not initiate checkout.");
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
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

  /* Obtener resumen de compra al montar */
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/checkout/summary");
        setSummary(res.data);
      } catch {
        setError("Could not load checkout summary.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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
        <CheckoutForm summary={summary} />
      </Elements>
    </section>
  );
}
