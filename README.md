🛍️ Koala T-Shirts – E-commerce Web App (FastAPI + React)
Koala T-Shirts is a modern, full-featured e-commerce web application built with FastAPI for the backend and React + TailwindCSS on the frontend. The app includes product filtering, shopping cart functionality, secure user authentication, and Stripe payment integration.

Originally developed as part of a formal assessment in the Certificate IV in Information Technology (ACBI, Sydney), the project has since evolved into a real-world portfolio application and is under active development.

🚀 Features
✅ Product catalog from real-time backend data

✅ Filter by category and search term

✅ Add to cart, remove, and update quantities

✅ Authentication (login, register, logout)

✅ Stripe integration for checkout (in progress)

✅ Protected routes and role-based UI

✅ Responsive UI (desktop & mobile)

🔧 Tech Stack
Frontend: React, TailwindCSS, React Router, Axios

Backend: FastAPI, SQLAlchemy, JWT Authentication

Database: SQLite (dev), PostgreSQL (planned)

Deployment: Netlify (frontend), Render or local (backend)

Payments: Stripe API

🗂️ Project Structure
pgsql
Copy
Edit
koala-tshirts/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── routes/
│   │   ├── schemas.py
│   │   └── database.py
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── App.jsx
├── README.md
📦 Backend API Highlights
GET /products/ → List all products

GET /products?cat=t-shirts → Filter by category

POST /auth/login → User login

POST /auth/register → Create new user

POST /cart/ → Add to cart

PUT /cart/{item_id} → Update quantity

DELETE /cart/{item_id} → Remove from cart

(Full API documentation available via Swagger at /docs once running)

📈 Developer Notes
This project is still in progress (~85%) and being actively maintained.
Key features like product filtering, cart logic, and user auth are functional. Stripe integration and admin tools are currently being finalized.

The project originated in a formal training environment but was extended and modularized to follow real-world development practices. Code is version-controlled with Git, using branch-based workflow and merge conflict resolution.

▶️ Local Setup (Backend)
bash
Copy
Edit
git clone https://github.com/your-username/koala-tshirts
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
Visit http://127.0.0.1:8000/docs for Swagger UI.

🖥️ Frontend Setup
bash
Copy
Edit
cd frontend
npm install
npm run dev
Visit http://localhost:5173 to view the app.

🌐 Live Demo
Coming soon – deployment planned on Netlify (frontend) and Render (backend).

📬 Contact
Open to remote positions and collaborations.
Contact me at adrianlive1024@gmail.com or via GitHub.
