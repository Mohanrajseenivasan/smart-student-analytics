# Smart Student Behavior Analytics

A comprehensive analytics platform for tracking and predicting student engagement, performance, and behavioral trends using Machine Learning.

## 🚀 Tech Stack

- **Frontend:** React (Vite), Tailwind CSS, Chart.js
- **Backend:** Node.js, Express.js
- **Database:** MySQL (Sequelize ORM)
- **Machine Learning:** Python (Scikit-learn)

## 📂 Project Structure

```
├── backend/              # Node.js API Server
│   ├── config/           # DB Configuration
│   ├── controllers/      # Route Logic
│   ├── models/           # Sequelize Models
│   ├── routes/           # API Endpoints
│   ├── ml/               # Python ML Scripts
│   └── ...
├── frontend/             # React Client Application
│   ├── src/
│   │   ├── components/   # Reusable Components
│   │   ├── pages/        # Route Components
│   │   └── ...
│   └── ...
└── ARCHITECTURE.md       # Detailed System Design & Diagrams
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18+)
- MySQL Server
- Python 3.8+ (for ML scripts)

### 1. Database Setup
Create a MySQL database named `student_behavior_analytics`.
```sql
CREATE DATABASE student_behavior_analytics;
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env from example
cp .env.example .env
# Edit .env with your MySQL credentials

# Run Server (Development)
npm run dev
```
The server will start on `http://localhost:5000`.

### 3. Frontend Setup
```bash
cd frontend
npm install

# Create .env from example
cp .env.example .env

# Run Client (Development)
npm run dev
```
 The client will start on `http://localhost:5173`.

## 🌿 Branching Strategy

We follow a simplified Git Flow:

- **main**: Production-ready code. Protected branch.
- **dev**: Integration branch for development. PRs merge here.
- **feature/**: For new features (e.g., `feature/login-page`, `feature/dashboard-charts`).
- **fix/**: For bug fixes (e.g., `fix/auth-error`).
- **chore/**: Maintenance tasks (e.g., `chore/dependency-updates`).

### Workflow
1.  Checkout `dev`: `git checkout dev`
2.  Create feature branch: `git checkout -b feature/my-feature`
3.  Commit changes.
4.  Push and create Pull Request to `dev`.

## 📖 Key Documentation
- [Architecture & Design](ARCHITECTURE.md) - System flow, ER Diagrams, and UI/UX Details.

## 🤝 Contributing
1.  Fork the repository.
2.  Create your feature branch.
3.  Commit your changes.
4.  Push to the branch.
5.  Open a Pull Request.

