# Project State – Koala T-Shirts

## Overview
This repository is a full-stack e-commerce app: a FastAPI backend with SQLite, a Vite/React frontend, and an optional Docker Compose setup.

---

## Current Status

### Backend
- FastAPI app running on `http://localhost:8000` (uvicorn).
- Entry point corrected to `app.main:app`.
- All `/api/*` routes are operational:
  * `/api/products/` – list products (GET)
  * `/api/products/{id}` – product details (GET)
  * `/api/cart/` – get cart (GET)
  * `/api/cart/items` – add/update items (POST)
  * `/api/orders/checkout` – create order and Stripe PaymentIntent (POST)
  * `/api/checkout/webhook` – Stripe webhook (POST)
- Auth middleware works; `get_current_user` and `get_current_admin` are in place.
- Stripe configuration uses `config.STRIPE_CURRENCY`.
- Database (`koala.db`) is populated with sample categories and products.
- No automated tests – manual testing is required.

### Frontend
- React (Vite) app in `frontend/`.
- API base URL set via `VITE_API_URL=http://localhost:8000`.
- Fetch paths now correctly use `/api/*`.
- Stripe publishable key present (`VITE_STRIPE_PUBLISHABLE_KEY`).

### Docker
- `docker-compose.yml` defines `backend` and `frontend` services.
- Frontend Dockerfile uses `@rollup/rollup-linux-x64-gnu` for bundling.

## Integration Check Results
| Feature | Result | Notes |
|---------|--------|-------|
| Backend server start | ? | uvicorn listening on port 8000 |
| `/api/products/` 200 OK | ? | JSON list returned |
| CORS from `localhost:5173` | ? | Allowed origins include 5173 |
| Cart CRUD | ? | Works, persists per user |
| Checkout flow | ? | PaymentIntent created, webhook updates order |
| Console errors | ?? | Minor Stripe-JS warnings; no critical errors |

## Next Steps (Frontend-focused)
1. Verify product listing UI displays correctly.
2. Test Add to Cart and cart persistence.
3. Confirm checkout page sends PaymentIntent and redirects.
4. Clean up any remaining console warnings.

## Summary
The backend is stable and fully functional; the frontend has been aligned with the new API routes and Stripe integration. Remaining tasks are UI/UX polish and validation of the full purchase flow.

