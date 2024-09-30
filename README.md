# Todo App

A feature-rich Todo App built using Node.js, Express, and Sequelize, with user authentication, session management, and CSRF protection. The app allows users to create an account, log in, manage their todos (add, delete, mark as complete), and stay secure with session-based login and CSRF protection. Automated tests are implemented using Jest.

## Features

- **User Authentication**: Sign up, log in, log out
- **Todo Management**: Add, delete, and mark todos as completed
- **Session-Based Login**: Persistent login sessions with Express-Session
- **CSRF Protection**: Secure forms with CSRF tokens
- **Flash Messages**: Real-time feedback on actions such as login failure, signup validation, etc.
- **Automated Testing**: Tests for login, signup, adding todos, and more using Jest and Supertest

## Tech Stack

- **Backend**: Node.js, Express.js
- **Authentication**: Passport.js (local strategy)
- **Database**: PostgreSQL (via Sequelize ORM)
- **Templating**: EJS
- **Security**: CSRF protection using `tiny-csrf`
- **Session Management**: Express-session
- **Testing**: Jest, Supertest
- **Other Tools**: Nodemon (development), ESLint and Prettier (code quality), Husky (pre-commit hooks)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/hamanpure/Todo-app.git
   cd Todo-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   Create a `.env` file in the root directory with the following details:

   ```
   DB_NAME=your_database_name
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_HOST=your_database_host
   SESSION_SECRET=your_session_secret
   ```

4. Initialize the database:

   Run the following commands to create the database and apply migrations:

   ```bash
   npx sequelize-cli db:create
   npx sequelize-cli db:migrate
   ```

5. Start the application:

   - For development (with live reloading):

     ```bash
     npm start
     ```

   - For production:

     ```bash
     npm start:prod
     ```

## Usage

### User Authentication

- **Signup**: Go to `/signup`, create an account, and log in.
- **Login**: Go to `/login`, enter your email and password to log in.
- **Logout**: Click the signout button to log out of the session.

### Todo Management

- **Add Todo**: Once logged in, you can add todos by filling out the form on the `/todos` page.
- **Mark Complete**: Mark any todo as completed.
- **Delete Todo**: Remove any todo from the list.

### Security Features

- **CSRF Protection**: CSRF tokens are used to protect against cross-site request forgery.
- **Session Management**: User login sessions are persistent and secure.

## Testing

To run the tests:

```bash
npm test
```

This will run all tests related to user authentication, todo creation, deletion, and marking as completed.

## Code Quality

### Linting

To run the linter:

```bash
npx lint-staged
```
