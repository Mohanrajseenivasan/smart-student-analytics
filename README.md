# Smart Student Behavior Analytics

A comprehensive web application designed to track, analyze, and improve student performance and behavior using real-time analytics and machine learning.

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 📖 Table of Contents
- [About the Project](#about-the-project)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Database Setup](#database-setup)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## 🧐 About the Project
**Smart Student Behavior Analytics** is a data-driven platform that helps educational institutions monitor student progress. It combines academic grades, attendance records, and behavioral patterns to generate actionable insights.

The system features a dual-interface dashboard:
*   **Faculty View:** Aggregate class performance, identify at-risk students, and manage alerts.
*   **Student View:** Personalized dashboard showing attendance, grades, class rank, and upcoming assignments.

## ✨ Key Features
*   **User Role Management:** Secure login for Students, Faculty, Admins, Counselors, and HODs.
*   **Real-time Dashboard:** Interactive charts and statistics using Chart.js.
*   **Behavioral Analysis:** ML-powered risk scoring (Low, Medium, High, Critical).
*   **Alert System:** Automated notifications for low attendance or dropping grades.
*   **Goal Tracking:** Students can set and track personal academic goals.
*   **Responsive Design:** Modern UI built with React and Tailwind CSS.
*   **Secure API:** JWT-based authentication and protected routes.

## 🛠️ Technology Stack

### Frontend
*   **Framework:** [React 19](https://react.dev/) (Vite)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Routing:** React Router DOM
*   **Charts:** Chart.js & React-Chartjs-2
*   **HTTP Client:** Axios

### Backend
*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **ORM:** Sequelize
*   **Database:** MySQL
*   **Authentication:** JSON Web Tokens (JWT) & BCrypt
*   **Validation:** Express-Validator

### Machine Learning
*   **Language:** Python 3.x
*   **Libraries:** Scikit-learn, Pandas, NumPy (Integration via child processes)

## 🚀 Getting Started

### Prerequisites
Ensure you have the following installed:
*   [Node.js](https://nodejs.org/) (v16.x or higher)
*   [MySQL](https://www.mysql.com/) (v8.0 or higher)
*   [Python](https://www.python.org/) (v3.8 or higher)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Mohanrajseenivasan/smart-student-analytics.git
    cd smart-student-analytics
    ```

2.  **Backend Setup**
    ```bash
    cd backend
    npm install
    ```
    *   Create a `.env` file in the `backend` directory (see `.env.example`).
    *   Configure your database credentials in `.env`.

3.  **Frontend Setup**
    ```bash
    cd ../frontend
    npm install
    ```

4.  **ML Environment (Optional)**
    ```bash
    cd ../backend/ml
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    pip install -r requirements.txt
    ```

### Database Setup
1.  Open your MySQL Client (Workbench or Command Line).
2.  Create the database:
    ```sql
    CREATE DATABASE student_behavior_analytics;
    ```
3.  The application uses **Sequelize**, so tables will be auto-generated when you start the backend.
4.  *Optional:* Run the provided SQL scripts in `database_setup.sql` to populate initial seed data.

## 🏃 Usage

1.  **Start the Backend Server**
    ```bash
    cd backend
    npm run dev
    # Server runs on http://localhost:5000
    ```

2.  **Start the Frontend Client**
    ```bash
    cd frontend
    npm run dev
    # Client runs on http://localhost:5173
    ```

3.  Open your browser and navigate to `http://localhost:5173`.

### Default Login
*   **Student:** `test@student.com` / `password123` (or as configured in your DB)
*   **Faculty:** `faculty@test.com` / `password123`

## 📂 Project Structure

```
smart-student-analytics/
├── backend/                # Node.js API Server
│   ├── config/             # DB Configuration
│   ├── controllers/        # Route Logic
│   ├── middleware/         # Auth & Error Handling
│   ├── models/             # Sequelize Models (MySQL)
│   ├── routes/             # API Routes
│   └── ml/                 # Python Scripts
│
├── frontend/               # React Application
│   ├── src/
│   │   ├── components/     # Reusable UI Components
│   │   ├── pages/          # App Pages
│   │   ├── services/       # API Service Files
│   │   └── context/        # Global State (Auth)
│   └── public/             # Static Assets
│
└── README.md
```

## 🤝 Contributing
Contributions are welcome! Please follow these steps:
1.  Fork the Project.
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the Branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📝 License
This project is licensed under the MIT License.