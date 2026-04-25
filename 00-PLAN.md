# Koala Ecommerce Master Plan

## Goal
Turn Koala into a fully functional clothing ecommerce with:
- storefront
- login and registration
- guest and authenticated cart flows
- Stripe checkout
- order lifecycle
- admin panel
- enough tests and validation to trust normal user flows

This file is the master operational plan for local-worker conversations.

## Working Model
- This conversation is the control tower.
- Local model conversations are execution workers.
- Each local conversation works on exactly one bounded task.
- The local worker must not choose the next task on its own.
- `01-HANDOFF.md` always defines the only task the local worker may execute.
- `02-LOG.md` records what actually happened, not what was intended.

## Source Of Truth
- Use this file for roadmap, priorities, and task state.
- Use `01-HANDOFF.md` for the current worker task.
- Use `02-LOG.md` for execution history.
- Do not use `project_state.md` as an operational source of truth.

## Worker Rules
1. Read `01-HANDOFF.md` first.
2. Read only the minimum additional context required by the handoff.
3. Work on one task only.
4. Do not edit files outside the allowed list.
5. Do not "helpfully" fix nearby code outside the current task.
6. Replace full functions cleanly when a task says to rewrite a function.
7. Do not leave old logic below rewritten logic.
8. Run the exact validation command in the handoff.
9. If validation fails, stop and report the real failure.
10. Do not mark a task done unless validation passes.
11. Update `02-LOG.md` honestly after the task.
12. Do not update roadmap state for tasks you did not complete.

## Local-First Strategy
Use the local model for:
- bounded frontend fixes
- bounded backend fixes
- config cleanup
- lint cleanup
- test setup
- file-level refactors with explicit boundaries
- admin UI CRUD blocks

Use cloud guidance for:
- Stripe and order architecture
- auth/security review
- cross-cutting frontend/backend contracts
- review and orchestration

## Product Scope

### Core Storefront
- home page
- product listing
- product detail
- category/filter support
- cart
- checkout
- order confirmation

### User Account
- register
- login
- logout
- session persistence
- role-based admin access

### Commerce
- guest cart
- authenticated cart
- stock-aware product purchase flow
- order creation
- payment confirmation
- order history if backend shape permits

### Admin
- product list
- product create
- product edit
- stock management
- category visibility if supported

## Current State Snapshot

### Confirmed Working
- backend auth optional guest dependency fix in `backend/app/auth.py`
- frontend `CartContext.jsx` now builds with guest cart actions restored
- frontend Jest config loads correctly with jsdom
- frontend tests now run successfully
- frontend lint has no errors
- frontend `npm.cmd run build` passes

### Confirmed Incomplete / Risky
- frontend lint still has two `react-refresh/only-export-components` warnings in context files
- frontend API client conventions still need consolidation
- checkout payment flow is insecure and incomplete
- Stripe webhook still has TODO behavior
- operational docs need to stay in sync with real code state

## Execution Phases

### Phase 1: Foundation Stabilization
Objective:
- keep build green
- make tests usable
- reduce config drift
- make local-worker iteration safe

Tasks:
- `T1` Optional auth for guest checkout
- `T2` Guest cart recovery
- `T3` Jest configuration recovery
- `T4` Mechanical lint cleanup
- `T5` Frontend API client and token normalization

### Phase 2: Auth And User Flows
Objective:
- verify login/register/session behavior
- verify protected/admin route behavior
- identify missing account flows

Tasks:
- `T6` Validate auth flow end-to-end
- `T7` Verify admin gating in frontend and backend

### Phase 3: Checkout And Orders
Objective:
- redesign and implement safe order + Stripe flow

Tasks:
- `T8` Design secure checkout lifecycle
- `T9` Implement backend pending-order + payment-intent flow
- `T10` Implement frontend checkout flow against the new contract
- `T11` Implement webhook completion and cart clearing

### Phase 4: Admin Panel Completion
Objective:
- make product admin workflows practical

Tasks:
- `T12` Validate admin product list
- `T13` Validate product create/edit flow
- `T14` Validate stock update workflow

### Phase 5: QA And Product Polish
Objective:
- make the project feel complete and demoable

Tasks:
- `T15` Smoke test critical user journeys
- `T16` Add focused regression tests
- `T17` Improve UI consistency and empty/error states

## Task Board

### T1 Optional Auth For Guest Checkout
Status: `done`
Owner: local worker + cloud review
Files:
- `backend/app/auth.py`
Validation:
- code inspection
Notes:
- `optional_oauth2_scheme` added with `auto_error=False`

### T2 Guest Cart Recovery
Status: `done`
Owner: local worker + cloud review
Files:
- `frontend/src/context/CartContext.jsx`
Validation:
- `npm.cmd run build` in `frontend`
Notes:
- `addToCart`, `updateItemQty`, `removeItem`, and `clearCart` now exist and build passes

### T3 Jest Configuration Recovery
Status: `done`
Owner: local worker + cloud cleanup
Allowed files:
- `frontend/jest.config.js`
- `frontend/package.json`
- `frontend/package-lock.json`
- `00-PLAN.md`
- `02-LOG.md`
Validation:
- `npm.cmd run test:ci -- --watch=false`
Done when:
- Jest loads the intended config
- jsdom is active
- failure is no longer `document is not defined`
Notes:
- malformed `frontend/jest.config.js` replaced
- typo config file removed
- `jest-environment-jsdom` added
- frontend tests now pass

### T4 Mechanical Lint Cleanup
Status: `done`
Owner: local worker + cloud cleanup
Allowed files:
- `frontend/__mocks__/fileMock.js`
- `frontend/src/components/__tests__/FilterBar.test.jsx`
- `frontend/src/components/Carousel.jsx`
- `frontend/src/pages/FAQ.jsx`
- `frontend/eslint.config.js`
- `00-PLAN.md`
- `02-LOG.md`
Validation:
- `npm.cmd run lint`
Done when:
- lint passes, or only a small justified remainder exists
Notes:
- lint now passes with 0 errors
- remaining warnings are `react-refresh/only-export-components` in `AuthContext.jsx` and `CartContext.jsx`
- those warnings are non-blocking and require a separate structural cleanup if we want them gone

### T5 Frontend API Client And Token Normalization
Status: `in-progress`
Owner: local worker with cloud review
Allowed files:
- `frontend/src/api/axios.js`
- `frontend/src/api/apiClient.js`
- `frontend/src/api/request.js`
- directly affected consumers only
- `00-PLAN.md`
- `02-LOG.md`
Validation:
- `npm.cmd run build`
Done when:
- frontend route usage is consistent
- token key usage is consistent

### T6 Validate Auth Flow End-To-End
Status: `todo`
Owner: local worker
Allowed files:
- read-only inspection first
- implementation files only after approved handoff
Validation:
- frontend build
- backend route inspection
Done when:
- login/register/logout/session persistence are verified or gaps are documented precisely

### T7 Verify Admin Gating
Status: `todo`
Owner: local worker
Validation:
- code inspection
- targeted build if frontend changes

### T8 Design Secure Checkout Lifecycle
Status: `pending-cloud-design`
Owner: cloud first
Notes:
- do not delegate implementation until the contract is defined

### T9 Implement Backend Pending-Order + PaymentIntent Flow
Status: `blocked-by-T8`

### T10 Implement Frontend Checkout Against New Contract
Status: `blocked-by-T8`

### T11 Implement Webhook Completion And Cart Clearing
Status: `blocked-by-T8`

### T12 Validate Admin Product List
Status: `todo`

### T13 Validate Product Create/Edit Flow
Status: `todo`

### T14 Validate Stock Update Workflow
Status: `todo`

### T15 Smoke Test Critical User Journeys
Status: `todo`

### T16 Add Focused Regression Tests
Status: `todo`

### T17 Improve UI Consistency And Empty/Error States
Status: `todo`

## UI Track
We will use Stitch as the UI generation/design layer when available.

Initial Stitch target screens:
- Home
- Product List
- Product Detail
- Cart
- Checkout
- Order Confirmation
- Login/Register
- Admin Product List
- Admin Product Form

UI generation should support implementation, not replace the bounded worker protocol.

## Current Priority
1. `T5` API client/token normalization
2. `T6` Auth flow verification
3. `T7` admin gating verification
4. `T8` cloud design for checkout + Stripe
5. `T12` admin product flow validation

## Validation Commands
- Frontend build: `npm.cmd run build`
- Frontend lint: `npm.cmd run lint`
- Frontend tests: `npm.cmd run test:ci -- --watch=false`
