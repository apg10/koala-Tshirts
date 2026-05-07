# Koala T-Shirts

Koala T-Shirts is a full-stack ecommerce web application for a clothing store, built with a FastAPI backend and a React/Vite frontend. The project started as a class assignment and has been expanded into a portfolio-grade ecommerce system with authentication, cart flows, admin product management, Stripe checkout integration, and a growing automated test suite.

The current focus is turning the original school project into a practical, maintainable ecommerce application while also experimenting with a hybrid cloud/local AI development workflow.

## Current Features

- Product catalog backed by the API.
- Product filtering and search.
- Guest and authenticated cart flows.
- User registration, login, logout, and token-based auth.
- Optional authentication for hybrid guest/user checkout.
- Admin-protected product management.
- Product create/edit/delete flows in the admin panel.
- Stripe PaymentIntent creation for checkout.
- Stripe webhook endpoint for payment completion handling.
- Checkout safeguards for invalid quantities, missing shipping, nonexistent products, and insufficient stock.
- Frontend checkout flow using Stripe Elements.
- Backend regression tests for auth, products, categories, carts, orders, admin gating, and checkout edge cases.

## Tech Stack

**Frontend**

- React 19
- Vite
- React Router
- Axios
- Stripe React SDK
- Jest and React Testing Library
- CSS modules/design-system CSS

**Backend**

- FastAPI
- SQLAlchemy
- Pydantic
- SQLite for local development
- PostgreSQL-ready dependency stack
- JWT authentication
- Stripe Python SDK
- Pytest

## Project Structure

```text
koala-tshirts/
  backend/
    app/
      main.py
      auth.py
      database.py
      models.py
      schemas.py
      routes/
    tests/
  frontend/
    src/
      api/
      components/
      context/
      pages/
  coordination/
  docs/
```

## Local Setup

Clone the repository:

```powershell
git clone https://github.com/apg10/koala-Tshirts.git
cd koala-Tshirts
```

### Backend

```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

FastAPI docs are available at:

```text
http://127.0.0.1:8000/docs
```

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

The frontend runs at:

```text
http://localhost:5173
```

## Environment Notes

Stripe checkout requires environment variables for the backend and frontend. At minimum, local development needs Stripe API keys configured before live payment flows can be exercised.

The backend is designed for local SQLite development, with PostgreSQL dependencies included for future production deployment.

## Validation Commands

Backend tests:

```powershell
cd backend
.\venv\Scripts\python.exe -m pytest tests -q
```

Frontend build:

```powershell
cd frontend
npm.cmd run build
```

Frontend tests:

```powershell
cd frontend
npm.cmd run test:ci
```

## Development Workflow: Cloud + Local AI Pipeline

This project is also being used as a practical experiment in hybrid AI-assisted software development.

The workflow separates responsibilities between cloud and local models:

- **Cloud control / senior reviewer:** Codex is used as the source of truth for architectural decisions, code review, validation strategy, and final integration.
- **Local implementation worker:** Qwen Coder models run locally through OpenCode and are assigned small, bounded implementation tasks.
- **Local reviewer/planner:** GPT-OSS runs locally for diff reviews, progress reports, planning notes, and task coordination.
- **Shared protocol files:** The repository includes task, handoff, outbox, review, and coordination markdown files so local workers can operate with tight scope and leave auditable traces.

This approach was intentionally tested to reduce cloud-token usage while keeping a senior review loop in place. The most reliable pattern so far has been:

1. Define a narrow task with explicit allowed files.
2. Let the local model implement only that task.
3. Run validation.
4. Use a reviewer pass over the actual diff.
5. Commit only when the implementation matches the requested scope.

The workflow is not treated as magic automation. Local model output is reviewed, rejected, repaired, or committed based on tests and concrete diffs.

## Current Development Status

The project is actively maintained. The backend and frontend build successfully in the current main branch, and the backend test suite covers the most important ecommerce and checkout paths.

Areas still planned:

- Cleaner production deployment configuration.
- More complete admin dashboard polish.
- Better checkout completion UX after Stripe payment success.
- Email/order confirmation flows.
- Additional frontend test coverage.
- Final production environment documentation.

## Contact

Created and maintained by Adrian.

- GitHub: [apg10](https://github.com/apg10)
- Email: adrianlive1024@gmail.com
