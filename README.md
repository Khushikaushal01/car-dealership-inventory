# TDD Kata: Car Dealership Inventory System

A modern, full-stack single-page application (SPA) built to manage a car dealership's inventory. This project was developed with a strict adherence to Test-Driven Development (TDD) principles, a clean architecture, and modern web aesthetics (inspired by classic JDM car magazines).

## 🚀 Tech Stack

**Frontend:**
- React (Vite)
- Tailwind CSS
- React Router DOM
- Axios

**Backend:**
- Python 3 / FastAPI
- **SQLite (Persistent File-based Database)**
- SQLAlchemy (ORM)
- Pytest (for TDD)
- JWT Authentication

---

## 🛠️ Setup Instructions (macOS)

### 1. Backend Setup
Navigate to the backend directory and set up the Python environment:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip3 install -r requirements.txt
```

**Environment Variables:**
Create a `.env` file in the `backend/` directory based on `.env.example`:
```bash
cp .env.example .env
```
*(Ensure you set your `JWT_SECRET` in the `.env` file).*

**Run the Backend Server:**
```bash
./venv/bin/uvicorn main:app --reload
```
The API will be running at `http://127.0.0.1:8000`. You can view the interactive API docs at `http://127.0.0.1:8000/docs`.

**Running Tests (TDD):**
```bash
pytest -v
```

### 2. Frontend Setup
Open a new terminal, navigate to the frontend directory:
```bash
cd frontend
npm install
```

**Run the Frontend Development Server:**
```bash
npm run dev
```
The application will be running at `http://localhost:5173`.

---

## 🤖 My AI Usage

As per the AI Usage Policy, this section details my collaboration with Artificial Intelligence during the software development lifecycle of this project.

### Which AI tools I used:
- **ChatGPT:** Used for initial requirement analysis and brainstorming the overall architecture.
- **Antigravity / Claude AI-DLC:** Used as primary pair-programming agents for executing the TDD workflow, generating code, and formatting git history.
- **VS Code:** Used as the primary IDE.

### How I used them:
1. **Architecture & Brainstorming:** I used ChatGPT to break down the prompt requirements into a logical plan, deciding on FastAPI for the backend and Vite/React for the frontend.
2. **TDD Workflow:** I utilized Antigravity and Claude AI-DLC to follow a strict Red-Green-Refactor cycle. I would prompt the AI to write failing tests (`pytest`) for an endpoint (e.g., User Registration). After verifying the tests failed, I instructed the AI to write the minimal implementation to pass the tests.
3. **UI/UX Generation:** I provided the AI agents with specific design guidelines ("Indian Pricing format, specific color hex codes, modern UI") and had them generate the React + Tailwind boilerplate for components like `Dashboard.jsx` and `Admin.jsx`.
4. **Git History Management:** I used the AI to help write clean, conventional commit messages and ensure the `Co-authored-by` trailers were correctly appended to every commit where AI was involved.

### My reflection on how AI impacted my workflow:
Working with AI drastically accelerated my development speed, particularly when setting up boilerplate code, configuring Tailwind utilities, and writing repetitive unit tests. 

However, I learned that AI is a tool, not an autopilot. **It requires strict orchestration and continuous manual review.** For instance:
- I had to explicitly instruct the AI to remove security vulnerabilities (e.g., ensuring a client couldn't pass `is_admin=True` during registration).
- I had to manage the environment variables manually to ensure secrets like `JWT_SECRET` weren't hardcoded into the source files by the AI.
- I had to ensure that the database implementation used a persistent real database file and not an in-memory instance, aligning strictly with assessment guidelines.

Ultimately, using AI felt like having a very fast junior developer by my side. It handled the typing and the syntax, allowing me to focus entirely on system design, security, business logic, and the overall user experience.
