# Todo App

A simple Todo application that allows users to manage their tasks with authentication and session login features. Users can sign up, log in, add, view, mark as complete, and delete tasks (todos). The app also includes test coverage for core features.

## Features

- **User Authentication**: Sign up and log in with email and password.
- **CSRF Protection**: Secure application with CSRF tokens for critical requests.
- **Task Management**: Add, view, mark tasks as complete, and delete todos.
- **Flash Messages**: Error and success messages are displayed using connect-flash.
- **Sequelize ORM**: Database interaction via Sequelize, with support for PostgreSQL.
- **Session Management**: User sessions are managed using express-session.
- **Form Validation**: Handles user inputs with validation for signup, login, and todo creation.

## Live Demo

You can see the app live at: [Todo App Deployment](https://hamanpurevaibhav.onrender.com/)

## Installation

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)

### Steps

1. **Clone the repository:**

   ```bash
   git clone https://github.com/hamanpure/Todo-app.git
   cd Todo-app
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file and add your PostgreSQL database credentials:

   ```bash
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   DB_NAME=your_db_name
   ```

4. **Database Setup:**

   Initialize the database and run migrations:

   ```bash
   npx sequelize-cli db:create
   npx sequelize-cli db:migrate
   ```

5. **Start the application:**

   For development (with `nodemon` auto-reloading):

   ```bash
   npm run start
   ```

   For production:

   ```bash
   npm run start:prod
   ```

6. **Open the app in your browser:**

   ```bash
   http://localhost:3000
   ```

## Running Tests

The app includes tests for key features like sign-in, sign-out, add todo, delete todo, and mark todo as complete. To run the tests:

```bash
npm run test
```

## Project Structure

- `app.js`: The main application file, defining routes and middleware.
- `models/`: Contains Sequelize models for `User` and `Todo`.
- `views/`: EJS templates for rendering the frontend.
- `public/`: Static files like CSS and images.
- `routes/`: API endpoints for todos and user authentication.
- `test/`: Contains Jest tests for the core features.

## Dependencies

- `express`: Fast, unopinionated, minimalist web framework for Node.js.
- `passport`: Authentication middleware for Node.js.
- `sequelize`: ORM for SQL databases.
- `ejs`: Embedded JavaScript templating for HTML rendering.
- `nodemon`: Tool to automatically restart the server for changes.
- `bcrypt`: Password hashing.
- `connect-flash`: Flash messages for displaying errors or success.
- `tiny-csrf`: Middleware for CSRF protection.

## Deployment

The app is deployed on Render. To deploy, follow these steps:

1. Fork the repository and connect it with your Render account.
2. Set up environment variables for PostgreSQL.
3. Deploy the application from the Render dashboard.

## License

This project is licensed under the ISC License. Feel free to use and modify.

---

This `README.md` provides a comprehensive overview of your app, its features, and the setup process!