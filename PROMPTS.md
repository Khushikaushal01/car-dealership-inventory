# AI Prompts History

This document logs the strategic prompts leveraged during the development of the Car Dealership Inventory System. The prompts were carefully engineered to act as instructions for an AI Pair Programmer, strictly adhering to the assessment guidelines (TDD, Clean Code, SOLID principles, and Security).

## Table of Contents
1. [Prompt 1: Persona Setup & Architectural Planning](#prompt-1-persona-setup--architectural-planning)
2. [Prompt 2: Backend Initialization & TDD Setup](#prompt-2-backend-initialization--tdd-setup)
3. [Prompt 3: User Database Models & Schemas](#prompt-3-user-database-models--schemas)
4. [Prompt 4: JWT Authentication & Security Hardening](#prompt-4-jwt-authentication--security-hardening)
5. [Prompt 5: TDD Cycle for Vehicle CRUD](#prompt-5-tdd-cycle-for-vehicle-crud)
6. [Prompt 6: Vehicle Inventory API Implementation](#prompt-6-vehicle-inventory-api-implementation)
7. [Prompt 7: Purchase & Restock Business Logic](#prompt-7-purchase--restock-business-logic)
8. [Prompt 8: Frontend Initialization & Tailwind Config](#prompt-8-frontend-initialization--tailwind-config)
9. [Prompt 9: Authentication UI (Login & Register)](#prompt-9-authentication-ui-login--register)
10. [Prompt 10: Interactive Dashboard & Search Filters](#prompt-10-interactive-dashboard--search-filters)
11. [Prompt 11: Protected Admin Panel Integration](#prompt-11-protected-admin-panel-integration)
12. [Prompt 12: Git History & Commit Formatting](#prompt-12-git-history--commit-formatting)

---

### Prompt 1: Persona Setup & Architectural Planning
* **Goal**: Establish the AI's role and plan the full-stack architecture.
* **Prompt**:
  > "Act as a Senior Full Stack Developer with extensive experience in Python and React. We are building a Car Dealership Inventory System. We will strictly adhere to Test-Driven Development (TDD) and SOLID principles. The tech stack will be FastAPI, SQLite (persistent file, not in-memory), React, and Tailwind CSS. Outline a clean folder structure for the backend before we start coding."

---

### Prompt 2: Backend Initialization & TDD Setup
* **Goal**: Initialize the project and configure the testing environment.
* **Prompt**:
  > "Set up the Python virtual environment and `requirements.txt`. Create the base FastAPI `main.py` file and configure the SQLite database connection using SQLAlchemy. Before writing any endpoints, set up Pytest with an isolated testing database fixture so we can follow the Red-Green-Refactor TDD cycle."

---

### Prompt 3: User Database Models & Schemas
* **Goal**: Define the data layer for authentication.
* **Prompt**:
  > "Write the SQLAlchemy database model for the `User`. It must include `id`, `username`, `email`, `password` (hashed), and `is_admin`. Next, create the corresponding Pydantic schemas (`UserCreate`, `UserLogin`, `UserOut`) for data validation. Ensure clear naming conventions are used."

---

### Prompt 4: JWT Authentication & Security Hardening
* **Goal**: Implement secure registration and login endpoints.
* **Prompt**:
  > "Following our TDD cycle, write failing tests for user registration and login. Once the tests fail, implement the `POST /api/auth/register` and `POST /api/auth/login` endpoints. Use JWT token-based authentication and bcrypt for hashing. **Security Critical**: Ensure clients cannot pass `is_admin=True` during registration to prevent privilege escalation. Load the `JWT_SECRET` securely from a `.env` file."

---

### Prompt 5: TDD Cycle for Vehicle CRUD
* **Goal**: Write tests for the vehicle management endpoints before implementation.
* **Prompt**:
  > "Write a comprehensive suite of failing Pytest cases for the Vehicle APIs. We need tests for creating a vehicle, listing vehicles, searching by criteria, updating details, and deleting a vehicle (restricted to admins). Ensure you test for 401/403 HTTP errors when unauthorized users try to access protected routes."

---

### Prompt 6: Vehicle Inventory API Implementation
* **Goal**: Implement the core CRUD operations to pass the previously written tests.
* **Prompt**:
  > "Now, implement the endpoints to make the failing vehicle tests pass: `POST /api/vehicles`, `GET /api/vehicles`, `GET /api/vehicles/search`, `PUT /api/vehicles/:id`, and `DELETE /api/vehicles/:id`. Verify that the delete route strictly requires an Admin JWT token."

---

### Prompt 7: Purchase & Restock Business Logic
* **Goal**: Add transactional logic for buying and restocking cars.
* **Prompt**:
  > "Implement the inventory transaction endpoints: `POST /api/vehicles/:id/purchase` (decreases quantity by 1, throws 400 if out of stock) and `POST /api/vehicles/:id/restock` (increases quantity, restricted to Admin only). Ensure SQLAlchemy handles these database commits properly."

---

### Prompt 8: Frontend Initialization & Tailwind Config
* **Goal**: Setup the Vite React environment and styling system.
* **Prompt**:
  > "Act as an Expert UX/UI Developer. Initialize a React SPA using Vite. Install and configure Tailwind CSS v4. Create a unified, premium design system inspired by classic JDM car magazines. Use specific hex codes (like `#f3edd9` for backgrounds and `#d1382b` for accents) and ensure the layout is fully responsive."

---

### Prompt 9: Authentication UI (Login & Register)
* **Goal**: Build the user-facing forms for the auth API.
* **Prompt**:
  > "Create the `Login.jsx` and `Register.jsx` components. They should feature glassmorphism or structured card layouts. Ensure the forms capture email, username, and password, and handle API error messages gracefully (e.g., catching FastAPI's 422 validation errors without crashing React)."

---

### Prompt 10: Interactive Dashboard & Search Filters
* **Goal**: Create the main storefront view for standard users.
* **Prompt**:
  > "Build the `Dashboard.jsx` component. It should fetch and display all active vehicles using the `GET /api/vehicles` endpoint. Format all vehicle prices strictly in Indian Rupees (₹) using `en-IN` locale numbering. Add a dynamic 'Purchase' button to each card that automatically disables and shows 'OUT OF STOCK' when the quantity reaches zero."

---

### Prompt 11: Protected Admin Panel Integration
* **Goal**: Build the management interface for administrators.
* **Prompt**:
  > "Create an `Admin.jsx` component that is only accessible if the logged-in user has `is_admin=True`. Include a form to Add New Vehicles and a data table to view the active catalogue. Add 'RESTOCK' and 'DELETE' actions next to each vehicle in the table, wired to our protected backend endpoints."

---

### Prompt 12: Git History & Commit Formatting
* **Goal**: Ensure transparency and version control best practices.
* **Prompt**:
  > "As we commit these features, ensure every commit message follows Conventional Commits guidelines (e.g., `feat:`, `fix:`, `style:`). Because you are generating the boilerplate and assisting in debugging, you must append the exact trailer `Co-authored-by: AI Tool Name <AI@users.noreply.github.com>` preceded by two empty lines at the end of every commit message."
