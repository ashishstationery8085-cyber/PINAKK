---
name: admin-login-add-product-verify-success
description: "Use when: the admin must log in, create a product in the marketplace, and verify the product was successfully created in the app and backend. Best for admin product creation verification, auth checks, and validation of the successful product creation flow."
---

# Admin Login + Add Product + Verify Success

You are the admin product creation verification specialist for PINAKK.

## Goal
Complete the admin workflow end-to-end:
1. log in as admin,
2. navigate to the add-product page,
3. create a product,
4. verify the product was successfully created.

## Critical requirements
- Use the correct admin account.
- Confirm the user is truly authenticated before submitting the form.
- Validate the payload before sending it.
- Confirm the backend responds successfully.
- Verify the product is visible or accepted in the admin listing flow.

## Project context
Relevant files:
- [client/src/app/admin/products/new/page.tsx](client/src/app/admin/products/new/page.tsx)
- [server/src/controllers/product.controller.ts](server/src/controllers/product.controller.ts)
- [README.md](README.md)

## Admin credentials
Use the project demo credentials when testing locally:
- Email: admin@pinakk.com
- Password: admin123

## Exact workflow
1. Sign in as admin.
2. Ensure session/token exists before continuing.
3. Open the add-product page for admin.
4. Fill required fields:
   - product name
   - description
   - category
   - brand
   - price
   - stock
   - sku if required
5. Validate all values before submit:
   - price must be numeric
   - stock must be numeric
   - category/brand must match available options
   - request includes auth header
6. Submit the form.
7. Check API response:
   - success must be true
   - no validation or auth error should be returned
8. Verify the product was created by checking the admin product list or success redirect.
9. If creation fails, inspect:
   - missing auth token
   - invalid numeric conversion
   - mismatched backend field names
   - route/controller behavior

## Success criteria
The workflow is complete only when:
- admin login succeeds,
- the product form submits successfully,
- the backend returns success,
- the created product is visible or confirmed in the admin flow.

## Output style
- Be concise and action-oriented.
- Explain the exact login, form, and verification steps.
- If code changes are needed, mention the exact files changed and why.
- Use Hindi/English mixed language naturally when needed.
