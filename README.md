# ZETWERK Banking

## Features

-   User registration and login
-   Transfers between accounts
-   Idempotent transfers using `Idempotency-Key`
-   Debit and credit transaction records
-   Paginated transaction history
-   Recent transactions
-   Optional balance visibility during transfers
-   Responsive UI – across mobile, tablet and PC

## Tech Stack

### Frontend
Next.js, React, TypeScript, Tailwind CSS, TanStack Query, React Hook Form, Zod, Sonner, Lucide React

### Backend
NestJS, TypeScript, Prisma, PostgreSQL, Neon, Passport JWT, bcrypt

## Useful Commands

### Backend {#backend-2}

``` bash
cd backend

npm run start:dev
npm run build
npm run lint
npm test
npm run test:e2e
```

### Frontend {#frontend-2}

``` bash
cd frontend

npm run dev
npm run build
npm run start
```


## Prerequisites

-   Node.js 22.x recommended
-   npm
-   PostgreSQL
-   Neon PostgreSQL for the simplest setup

## Local Setup

### 1. Clone {#1-clone}

``` bash
git clone https://github.com/KoushikMCN/zetwerk-banking.git
cd zetwerk-banking
```

### 2. Backend {#2-backend}

``` bash
cd backend
npm install
```

Create `backend/.env`:

``` env
DATABASE_URL=your_neon_database_url
JWT_SECRET=your_long_random_jwt_secret
FRONTEND_URL=http://localhost:3001
```

Never commit the real `.env` file or JWT secret.

Generate Prisma Client:

``` bash
npx prisma generate
```

If the project has Prisma migrations and the database needs them
applied:

``` bash
npx prisma migrate deploy
```

Start the API:

``` bash
npm run start:dev
```

The backend runs on:

``` text
http://localhost:3000
```

### 3. Frontend {#3-frontend}

In another terminal:

``` bash
cd frontend
npm install
```

Create `frontend/.env.local`:

``` env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Start Next.js:

``` bash
npm run dev
```

The frontend runs on:

``` text
http://localhost:3001
```

## Environment Variables

### Backend {#backend-1}

  Variable         Purpose
  ---------------- -----------------------------------------------
  `DATABASE_URL`   PostgreSQL/Neon connection string
  `JWT_SECRET`     JWT signing and verification secret
  `FRONTEND_URL`   Allowed frontend origin for credentialed CORS

Example:

``` env
DATABASE_URL=
JWT_SECRET=
FRONTEND_URL=
```

### Frontend {#frontend-1}

  Variable                Purpose
  ----------------------- ----------------------
  `NEXT_PUBLIC_API_URL`   Backend API base URL

Example:

``` env
NEXT_PUBLIC_API_URL=
```

Only values intentionally exposed to the browser should use the
`NEXT_PUBLIC_` prefix.

## Project Structure

``` text
zetwerk-banking/
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── types/
│   └── package.json
└── backend/
    ├── src/
    ├── prisma/
    │   └── schema.prisma
    └── package.json
```

## Authentication

Authentication uses a JWT stored in an HTTP-only cookie named:

``` text
access_token
```

The frontend does not directly access the token. API requests include
credentials so the browser can send the cookie.

### Auth endpoints

``` text
POST /auth/register
POST /auth/login
POST /auth/logout
GET  /auth/me
```

`/auth/me` is protected and can be used to verify the current session.

### Account Endpoints

``` text
GET /account
GET /account/transactions
```

Transaction history supports pagination.

## Transfer Flow

A transfer moves money atomically from one account to another.

``` text
Client
  │
  │ POST /transfers
  │ Idempotency-Key: <unique-key>
  ▼
NestJS
  │
  ├── Validate request
  ├── Find source account
  ├── Find destination account
  │
  └── Database transaction
        │
        ├── Check idempotency key
        ├── Lock both accounts
        ├── Check source balance
        ├── Debit source
        ├── Credit destination
        ├── Create transfer record
        ├── Create DEBIT transaction
        └── Create CREDIT transaction
        │
        ▼
      COMMIT
```

## Idempotency

Transfers use an `Idempotency-Key` to prevent duplicate money movement
caused by retries, double clicks, network retries, or client-side
request duplication.

Using the same key:

``` text
Request 1
Idempotency-Key: abc123
₹250
      ↓
Transfer created

Request 2
Idempotency-Key: abc123
₹250
      ↓
Existing transfer returned
```

The balance changes only once.

The database also enforces uniqueness on the idempotency key, protecting
against concurrent duplicate requests.

## Concurrency Control

The transfer operation uses PostgreSQL row-level locks:

``` sql
SELECT id, balance
FROM accounts
WHERE id IN (...)
ORDER BY id
FOR UPDATE;
```

Both accounts are locked before balances are checked or modified.

Accounts are locked in deterministic ID order, reducing deadlock risk
for simultaneous transfers such as:

``` text
A → B
B → A
```

All balance updates and transaction creation happen inside one database
transaction. If any operation fails, the complete transfer is rolled
back.

## Money Representation

Money is stored as integer paise rather than floating-point values:

``` text
₹100.50 → 10050 paise
₹25,000 → 2500000 paise
```

This avoids floating-point rounding issues during monetary calculations.

## Transaction Records

Every completed transfer creates two account-level transaction records:

``` text
Source account
    DEBIT  ₹250
    balanceAfter = ...

Destination account
    CREDIT ₹250
    balanceAfter = ...
```

The `Transfer` record represents the overall money movement.

## Sample Test Flow

### 1. Create two users {#1-create-two-users}

Register two accounts, for example:

``` text
User A
email: ramesh@example.com
password: Password123!
```

``` text
User B
email: suresh@example.com
password: Password123!
```

> New accounts receive a demo opening balance (25k INR) so transfers can be tested immediately.

### 2. Get account numbers {#2-get-account-numbers}

Log in as each user and note their account numbers.

Example:

``` text
Alice → ACC11111111
Bob   → ACC22222222
```

### 3. Transfer money {#3-transfer-money}

Log in as Alice and transfer:

``` text
Destination: ACC22222222
Amount: ₹250
```

Review and confirm.

Expected:

``` text
Alice balance = starting balance - ₹250
Bob balance   = starting balance + ₹250
```

### 4. Verify transactions {#4-verify-transactions}

Alice should see:

``` text
DEBIT ₹250
```

Bob should see:

``` text
CREDIT ₹250
```

The displayed balance-after value should match the account balance after
the transfer.

### 5. Test idempotency {#5-test-idempotency}

Repeat the exact same API request with the same `Idempotency-Key`.

Expected:

``` text
First request  → transfer created
Second request → existing transfer returned
```

The balance should change only once.

Then use a new idempotency key and verify that a new transfer is
created.

### 6. Test invalid transfers {#6-test-invalid-transfers}

Verify the following:

-   Nonexistent destination account
-   Transfer to the same account
-   Zero amount
-   Negative amount
-   More than two decimal places
-   Invalid monetary input
-   Insufficient balance
-   Missing/invalid idempotency key

These should produce appropriate client errors without changing
balances.

### 7. Test authentication {#7-test-authentication}

Log out and attempt to access:

``` text
/dashboard
/transfer
/transactions
```

The application should redirect to `/login`.

While logged out:

``` text
GET /auth/me
```

should return an unauthorized response.

### 8. Test guest routes {#8-test-guest-routes}

While logged in, navigate to:

``` text
/login
/register
```

The guest guard should redirect to:

``` text
/dashboard
```

### 9. Test session expiry {#9-test-session-expiry}

After the JWT expires:

``` text
authenticated request
        ↓
authentication failure
        ↓
session is cleared
        ↓
redirect to /login
```

Logging in again should establish a new session.

### 10. Test double-click protection {#10-test-double-click-protection}

Rapidly click **Confirm transfer** twice.

Expected:

-   Only one transfer is created
-   The button becomes disabled while submitting
-   Only one balance change occurs
-   The resulting transaction history contains one transfer

## Production Build

Backend:

``` bash
cd backend
npm run build
```

Frontend:

``` bash
cd frontend
npm run build
```

## Deployment

Recommended architecture:

``` text
Next.js
   │
   │ HTTPS + credentials
   ▼
NestJS API
   │
   │ DATABASE_URL
   ▼
Neon PostgreSQL
```

Configure production environment variables through the hosting provider.

Backend:

``` env
DATABASE_URL=your_neon_connection_string
JWT_SECRET=your_production_secret
FRONTEND_URL=https://your-frontend-domain.example
```

Frontend:

``` env
NEXT_PUBLIC_API_URL=https://your-backend-domain.example
```

## Security Notes

-   JWTs are stored in HTTP-only cookies.
-   JWT secrets remain server-side.
-   Passwords are hashed with bcrypt.
-   Protected endpoints use JWT guards.
-   DTOs are validated with `class-validator`.
-   Unexpected DTO properties are rejected.
-   Money uses integer paise.
-   Transfers use database transactions.
-   Account rows are locked during balance updates.
-   Idempotency keys have a database unique constraint.
-   Sensitive credentials should never be committed.