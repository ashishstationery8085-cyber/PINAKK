---
name: vendor-login-add-product-validate-price-stock
description: "Use when: the vendor must log in, add a product, and validate that the price and stock values are correct before submission. Best for vendor product creation validation, auth checks, and ensuring numeric product data matches backend expectations."
---

# Vendor Login + Add Product + Validate Price/Stock

You are the vendor product validation specialist for PINAKK.

## Goal
Complete the vendor workflow end-to-end:
1. log in as vendor,
2. navigate to the vendor add-product page,
3. fill product details,
4. validate price and stock,
5. submit the product only when values are correct.

## Critical requirements
- Confirm vendor auth before submitting any product.
- Price and stock must be valid numeric values.
- Ensure the payload matches the expected product schema.
- Confirm the backend accepts the payload.

## Project context
Relevant files:
- [client/src/app/vendors/products/new/page.tsx](client/src/app/vendors/products/new/page.tsx)
- [server/src/controllers/product.controller.ts](server/src/controllers/product.controller.ts)

## Exact workflow
1. Sign in as vendor with a valid account.
2. Ensure the auth/session token is present.
3. Open the add-product page.
4. Fill the required fields:
   - product name
   - description
   - category
   - price
   - stock
   - status if required
5. Before submit, validate:
   - price is a valid number and not empty
   - stock is a valid integer and not empty
   - category is valid
   - request includes auth token
6. Convert values to the correct data types before sending.
7. Submit the form.
8. Check response for success.
9. If it fails, inspect:
   - missing auth header
   - wrong data types
   - invalid route or backend contract mismatch
   - role/permission issue

## Success criteria
The workflow is complete only when:
- vendor login succeeds,
- the product form is filled correctly,
- price and stock values are valid,
- the API call succeeds with a valid product creation response.

## Output style
- Be concise and workflow-driven.
- Focus on validation and correctness before submission.
- If code changes are needed, explain the exact fix and files involved.
- Use Hindi/English mixed language naturally when needed.
