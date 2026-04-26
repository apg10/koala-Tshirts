
## L6
- task: `T5`
- result: `failed-validation`
- files: `frontend/src/api/axios.js`, `frontend/src/api/apiClient.js`, `frontend/src/api/request.js`, `frontend/src/context/AuthContext.jsx`, `frontend/src/components/AdminProductForm.jsx`
- validation: `npm.cmd run build` failed due to invalid React syntax in AuthContext.jsx and duplicate token fallback in AdminProductForm.jsx
- notes: token key normalization applied but validation failed due to syntax errors

## L7
- task: `T5R`
- result: `done`
- files: `frontend/src/context/AuthContext.jsx`, `frontend/src/components/AdminProductForm.jsx`, `00-PLAN.md`, `02-LOG.md`
- validation: `npm.cmd run build` passed; `npm.cmd run lint` passed with 2 existing warnings
- notes: repaired AuthContext syntax and AdminProductForm token fallback

## L8
- task: `T5.1`
- result: `done`
- files: `frontend/src/components/AdminProductForm.jsx`
- validation: `npm.cmd run build` passed; `npm.cmd run lint` passed with 2 existing warnings
- notes: normalized admin product form to use the shared `api` client instead of raw `axios` and manual token handling

## L9
- task: `T5.2`
- result: `done`
- files: `frontend/src/components/ProductList.jsx`
- validation: `npm.cmd run build` passed; `npm.cmd run lint` passed with 2 existing warnings
- notes: normalized admin product list consumer to use the shared `api` client instead of `apiClient`

## L10
- task: `T5.3`
- result: `done`
- files: `frontend/src/api/apiClient.js`, `frontend/src/api/request.js`
- validation: `npm.cmd run build` passed; `npm.cmd run lint` passed with 2 existing warnings
- notes: removed unused alternate API helper clients after confirming no source imports remained

## L11
- task: `T5.4`
- result: `done`
- files: `00-PLAN.md`, `02-LOG.md`
- validation: `npm.cmd run build` passed; `npm.cmd run lint` passed with 2 existing warnings
- notes: closed frontend API client normalization and moved current priority to auth flow verification

## L12
- task: `T6.1`
- result: `inventory`
- files: `frontend/src/context/AuthContext.jsx`, `frontend/src/pages/Login.jsx`, `frontend/src/pages/Register.jsx`, `frontend/src/App.jsx`, `backend/app/routes/users.py`, `backend/app/auth.py`
- validation: none
- notes: Current frontend login/register/logout flow uses AuthContext with token stored in localStorage and injected into axios. Login calls /login endpoint with OAuth2PasswordRequestForm and stores access_token and user info. Register creates user then calls login. Backend auth uses OAuth2PasswordBearer with auto_error=False for optional guest checkout. Backend has separate optional_user dependency that allows missing tokens. Current gaps: no refresh token flow, no explicit expired-token UX beyond interceptor cleanup/redirect, route protection and admin gating still need focused verification, frontend stores only email/is_admin, not a full verified user profile. Recommended next micro-task: T6.2 read-only route protection and admin gating inventory

## L13
- task: `T6.2`
- result: `inventory`
- files: `frontend/src/App.jsx`, `frontend/src/components/AdminRoute.jsx`, `frontend/src/components/PrivateRoute.jsx`, `frontend/src/Layout.jsx`, `frontend/src/context/AuthContext.jsx`, `backend/app/auth.py`, `backend/app/routes/admin_products.py`, `backend/app/routes/products.py`, `backend/app/routes/categories.py`, `backend/app/routes/orders.py`
- validation: none
- notes: Frontend route protection: `/admin/*` routes are protected by `AdminRoute` component that checks `user.is_admin`. `/login` and `/register` are protected by `PrivateRoute` for authenticated users only. Admin links in layout are conditionally rendered only for `is_admin` users. Backend admin protection: `admin_products.py` routes all use `get_current_admin` dependency. `products.py` routes for creating/updating/deleting/bulk operations have `auth.get_current_admin` dependency. `categories.py` routes for creating/updating/deleting categories have `auth.get_current_admin` dependency. `orders.py` route for viewing all orders uses `auth.get_current_admin`. Backend admin mutation routes do have admin checks. Current gaps: admin routes are protected in frontend but the frontend admin gating depends on locally stored `user.is_admin`, so UI gating can be stale or locally manipulated, although backend still enforces admin authorization. Product list navigates to `/admin/products/edit/:id`, but App.jsx does not define that route. PrivateRoute exists but is not currently used for non-admin protected user routes. Recommended next micro-task: T6.3 add missing admin product edit route inventory or implementation plan, read-only first

## L14
- task: `T6.3`
- result: `inventory`
- files: `frontend/src/App.jsx`, `frontend/src/pages/admin/ProductList.jsx`, `frontend/src/components/ProductList.jsx`, `frontend/src/pages/admin/ProductNew.jsx`, `frontend/src/components/AdminProductForm.jsx`, `backend/app/routes/admin_products.py`
- validation: none
- notes: Frontend navigation: Product list navigates to `/admin/products/edit/:id` but App.jsx does not define that route. No edit page/component currently exists. AdminProductForm.jsx is currently create-only and not reusable for edit. Backend: admin_products.py has `/admin/products/{id}` endpoint for editing products. Recommended next micro-task: T6.4 implement admin product edit route/page with shared form component

## L15
- task: `T6.4`
- result: `done`
- files: `frontend/src/App.jsx`, `frontend/src/pages/admin/ProductEdit.jsx`
- validation: `npm.cmd run build` passed; `npm.cmd run lint` passed with 2 existing warnings
- notes: Added AdminProductEdit route at `/admin/products/edit/:id` in App.jsx. Created ProductEdit.jsx page component that reuses AdminProductForm with productId prop. The form component needs to be updated to support edit mode (fetch existing product data and update vs create).

## L16
- task: `T6.4R`
- result: `done`
- files: `frontend/src/components/AdminProductForm.jsx`, `02-LOG.md`
- validation: `npm.cmd run build` passed; `npm.cmd run lint` passed with 2 existing warnings
- notes: Modified AdminProductForm.jsx to support edit mode via productId prop. Form now fetches existing product data when productId is provided and switches between create and update modes. Button text changes dynamically based on whether editing or creating a product.

## L17
- task: `T6.4RR`
- result: `done`
- files: `frontend/src/components/AdminProductForm.jsx`, `02-LOG.md`
- validation: `npm.cmd run build` passed; `npm.cmd run lint` passed with 2 existing warnings
- notes: Fixed AdminProductForm.jsx edit mode by replacing setForm(res.data) with explicit field mapping to prevent image filename strings from being sent in FormData. Added proper category_id fallback logic. Updated button text for edit mode to "Guardar cambios".

## L18
- task: `T13.1`
- result: `done`
- files: `frontend/src/components/AdminProductForm.jsx`, `02-LOG.md`
- validation: `npm.cmd run build` passed; `npm.cmd run lint` passed with 2 existing warnings
- notes: AdminProductForm.jsx now requires size and color fields as required by backend. Image field is required only in create mode (required={!productId}) to align with backend contract while preserving existing create/edit behavior from T6.4RR.

## L19
- task: `T13.2`
- result: `done`
- files: `frontend/src/components/AdminProductForm.jsx`, `02-LOG.md`
- validation: `npm.cmd run build` passed; `npm.cmd run lint` passed with 2 existing warnings
- notes: Successful admin product create/edit now returns to `/admin/products` list
