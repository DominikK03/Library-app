# 📚 Library App

## 🌟 Overview
Library App is a modern web application designed to streamline library operations. It empowers users, librarians, and administrators with tools to manage book reservations, borrowing, and returns efficiently. The app also features user management and role-based access control for a seamless experience.

---

## ✨ Features

### 🌐 General Features
- 🔒 **User Authentication**: Secure login, registration, and role-based access control.
- 📱 **Responsive Design**: Optimized for both desktop and mobile devices.

### 👤 User Features
- 📖 **View Borrowed and Reserved Books**: Keep track of your library activity.
- ⏳ **Extend Borrowing Periods**: Request more time for your borrowed books.
- 📌 **Reserve Books**: Secure your favorite books in advance.
- 🔍 **View Book Details**: Explore detailed information about each book.

### 📚 Librarian Features
- 🛠️ **Manage Book Inventory**: Add, edit, or delete books effortlessly.
- 📤 **Issue and Return Books**: Handle user transactions with ease.
- ⏳ **Extend Borrowing Periods**: Assist users in extending their borrowing time.
- 📋 **Manage Reservations**: Oversee and manage user reservations.

### 🛡️ Admin Features
- 🧑‍💼 **Manage User Roles**: Assign roles such as Librarian or Admin.
- 👥 **View All Users**: Access a comprehensive list of registered users.

---

## 🛠️ Tech Stack

### Frontend
- ⚛️ **React.js**: For building dynamic user interfaces.
- 🎨 **Material-UI (MUI)**: For sleek and modern UI components.
- 🌐 **Axios**: For seamless API communication.

### Backend
- 🟢 **Node.js**: For scalable server-side logic.
- 🚀 **Express.js**: For building robust APIs.
- 🍃 **MongoDB**: For efficient database management.
- 🛠️ **Mongoose**: For elegant database modeling.

### Other Tools
- 🐳 **Docker**: For containerized deployment.
- 🔑 **JWT**: For secure authentication.
- 🧹 **ESLint**: For maintaining code quality.

---

## 🚀 Setup Instructions

### Prerequisites
- 🖥️ **Node.js** and **npm** installed.
- 🐳 **Docker** installed.

### Steps to Run the Application

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd Library-app
   ```

2. **Install Dependencies**
   - For the backend:
     ```bash
     cd server
     npm install
     ```
   - For the frontend:
     ```bash
     cd ../client
     npm install
     ```

3. **Set Up Environment Variables**
   - Create a `.env` file in the `server` directory with the following variables:
     ```env
     PORT=5000
     MONGO_URI=<your-mongodb-connection-string>
     JWT_SECRET=<your-jwt-secret>
     ```

4. **Run the Application**
   - Using Docker:
     ```bash
     docker-compose up
     ```
   - Without Docker:
     - Start the backend:
       ```bash
       cd server
       npm start
       ```
     - Start the frontend:
       ```bash
       cd ../client
       npm start
       ```

5. **Access the Application**
   - 🌐 Open your browser and navigate to `http://localhost:3000` for the frontend.
   - 🛠️ The backend API will be available at `http://localhost:5000`.

---

## 🧪 Testing
- 🧪 **Backend Tests**:
  ```bash
  cd server
  npm test
  ```
- 🧪 **Frontend Tests**:
  ```bash
  cd client
  npm test
  ```

---

## 📜 License
This project is licensed under the **MIT License**.
