# Current Worker Handoff

## Task ID
T5.1

## Task Name
Normalize AdminProductForm API usage

## Repository
- `C:\Users\adria\Programacion\Programacion\koala-tshirts`

## Branch
- `codex/local-iteration-shared-context`

## Read First
- `C:\Users\adria\Programacion\Programacion\koala-tshirts\03-WORKER-PROTOCOL.md`
- `C:\Users\adria\Programacion\Programacion\koala-tshirts\00-PLAN.md`
- `C:\Users\adria\Programacion\Programacion\koala-tshirts\02-LOG.md`

## Allowed Files
- `C:\Users\adria\Programacion\Programacion\koala-tshirts\frontend\src\components\AdminProductForm.jsx`
- `C:\Users\adria\Programacion\Programacion\koala-tshirts\00-PLAN.md`
- `C:\Users\adria\Programacion\Programacion\koala-tshirts\02-LOG.md`

## Do Not Modify
- backend files
- checkout/payment files
- auth context
- API client files
- admin product list files
- unrelated frontend files
- package files

## Objective
Make `AdminProductForm.jsx` use the shared frontend API client instead of raw `axios` calls and manual token handling.

## Requirements
1. Replace the raw `axios` import with the shared client:
   - use `import api from "../api/axios";`
2. Replace category loading:
   - from raw `axios.get(`${API}/categories`)`
   - to `api.get("/categories")`
3. Replace admin product creation:
   - from raw `axios.post(`${import.meta.env.VITE_API_URL}/admin/products`, fd, manual Authorization headers)`
   - to `api.post("/admin/products", fd)`
4. Remove the manual `localStorage.getItem("token")` read from this file.
5. Do not change UI markup or form behavior beyond the API client normalization.
6. Keep the file syntactically valid.

## Validation
Run both commands in:

`C:\Users\adria\Programacion\Programacion\koala-tshirts\frontend`

Commands:
- `npm.cmd run build`
- `npm.cmd run lint`

## Commit Rule
If and only if validation passes:
1. stage only the allowed files changed by this task
2. commit with message:
   - `T5.1 normalize admin product form API client`
3. report the commit hash
4. stop

If validation fails:
- do not commit
- report the real failure
- stop

## Stop Conditions
- do not continue to any other T5 subtask
- do not mark all of T5 complete
- do not edit files outside the allowed list
