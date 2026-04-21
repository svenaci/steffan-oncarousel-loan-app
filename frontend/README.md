# Carousel Loan Application

## Overview

This project implements a minimal loan application workflow with a frontend-first approach and a simple backend API.

It includes:

- A responsive loan application form
- Client-side validation for immediate feedback
- Backend validation as the source of truth
- Application creation and retrieval via API
- A persisted post-submit “Pending Review” state
- Focused tests for business rules, API behavior, and core UI flow

---

## Tech Stack

### Frontend
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- Vitest
- React Testing Library

### Backend
- Node.js
- Express
- TypeScript
- Vitest
- Supertest

---

## Requirements

- Node.js >= 20
- npm >= 10

---

## Project Structure

```text
frontend/
  app/
  components/
  lib/

backend/
  src/
    routes/
    lib/
    store.ts
    server.ts
    index.ts
 ```    

---

## Backend API

In-memory storage is used for simplicity.

Endpoints: 
- `POST /applications`

- `GET /applications/:id`

---

## MVP

The application implements a minimal loan application flow:

- User can fill out a loan application form
- Client-side validation provides immediate feedback
- User can submit the form to the backend API
- Backend validates and persists the application
- Application is fetched after creation
- UI displays a “Pending Review” status
- Submitted data is shown back to the user
- Loading and error states are handled

---

## Validation Rules

The following rules are enforced:

- Full Name is required
- Email is required and must be valid
- Annual Income must be a number greater than 0
- Loan Amount must be a number greater than 0
- Loan Amount must not exceed 5× Annual Income
- frontend valiation for immediate user feedback
- backend validation as the source of truth

---


## Setup
### 1. Install frontend dependencies
```bash
cd frontend
npm install
```
### 2. Install backend dependencies
```bash
cd ../backend
npm install
```
### 3. Configure frontend environment variables
Create frontend/.env.local:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

## Running the App
### Start the backend
```bash
cd backend
npm run dev
```
Backend runs on:
http://localhost:3001

Health check:
http://localhost:3001/health

### Start the frontend
```bash
cd frontend
npm run dev
```

Frontend runs on:
http://localhost:3000

## Running Tests
### Frontend tests
```bash
cd frontend
npm test
```

### Backend tests
```bash
cd backend
npm test
```

---

## Testing Approach

I intentionally kept frontend tests focused on user behavior rather than duplicating all backend validation coverage.

---

## Key Tradeoff

### Shared validation vs duplicated validation

I initially explored a shared validation layer between frontend and backend. In practice, this introduced extra complexity because the frontend and backend are separate apps and Next.js requires additional setup to consume external shared code cleanly.

Given the timeboxed nature of the assignment, I chose to duplicate the validation/types locally in each app and keep them aligned manually.

Why:

- keeps the setup simple
- avoids configuration overhead
- preserves backend as the source of truth
- still gives the frontend immediate validation feedback

---

## AI Usage Disclosure

- validate the initial breakdown of the assignment 
- suggest naming improvements for files, variables, and components
- suggest test cases, especially around edge cases
- help refine commit structure and README clarity

All implementation decisions, code structure, validation behavior, API design, and final code changes were reviewed and adjusted manually.