const express = require("express");
var csrf = require("tiny-csrf");
const app = express();
const bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
const path = require("path");

const passport = require("passport");
const connectEnsureLogin = require("connect-ensure-login");
const session = require("express-session");
const flash = require("connect-flash"); //connect-flash
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");

const saltRounds = 10;

app.set("views", path.join(__dirname, "views")); //set views
app.set("view engine", "ejs");
app.use(flash());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("shh! some secret string"));
app.use(csrf("this_should_be_32_cheracter_long", ["POST", "PUT", "DELETE"]));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "my-super-secret-key-23456789098765432 ",
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
  }),
);
app.use(passport.initialize());
app.use(passport.session());

//messages are available while rendering any ejs templates
app.use(function (request, response, next) {
  response.locals.messages = request.flash();
  next();
});

//apply strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    (username, password, done) => {
      User.findOne({ where: { email: username } })
        .then(async (user) => {
          const result = await bcrypt.compare(password, user.password);
          if (result) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Invalid password" });
          }
        })
        .catch((error) => {
          return done(error);
        });
    },
  ),
);

passport.serializeUser((user, done) => {
  console.log("Serializing user in session", user.id);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then((user) => {
      done(null, user);
    })
    .catch((error) => {
      done(error, null);
    });
});

const { Todo, User } = require("./models");

// GET all todos and render them
app.get("/", async (req, res) => {
  try {
    // Check if user is logged in
    if (req.isAuthenticated()) {
      // Redirect logged-in user to the /todos page
      return res.redirect("/todos");
    }

    res.render("index", {
      title: "Todo application",
      csrfToken: req.csrfToken(),
    });
  } catch (error) {
    console.log(error);
    return res.status(422).json(error);
  }
});

app.get("/todos", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
  try {
    const loggedInUser = req.user.id;
    const allTodos = await Todo.getTodo(loggedInUser);
    if (req.accepts("html")) {
      return res.render("todos", {
        allTodos,
        title: "Todo application",
        csrfToken: req.csrfToken(),
      });
    } else {
      return res.json(allTodos);
    }
  } catch (error) {
    console.log(error);
    return res.status(422).json(error);
  }
});

// GET all todos in JSON format
app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.findAll();
    res.setHeader("Content-Type", "application/json");
    return res.json(todos);
  } catch (error) {
    console.log(error);
    return res.status(422).json(error);
  }
});

//login page
app.get("/login", (req, res) => {
  res.render("login", {
    title: "Login",
    csrfToken: req.csrfToken(),
  });
});

//post method to handle login
app.post(
  "/session",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    console.log(req.user);
    res.redirect("/todos");
  },
);
//get signup page
app.get("/signup", (req, res) => {
  res.render("signup", { title: "Signup", csrfToken: req.csrfToken() });
});

//post for users
app.post("/users", async (req, res) => {
  //Hash password using bcrypt
  const hashedPwd = await bcrypt.hash(req.body.password, saltRounds);

  console.log(hashedPwd);
  // console.log("firstname",req.body.firstName)
  //Have to create user
  try {
    const user = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPwd,
    });
    req.login(user, (err) => {
      if (err) {
        console.log(err);
      }
      res.redirect("/todos");
    });
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      // Add validation errors to flash messages
      error.errors.forEach((e) => req.flash("error", e.message));
      return res.redirect("/signup");
    }
    if (error.name === "SequelizeUniqueConstraintError") {
      req.flash("error", "Email is already in use");
      return res.redirect("/signup");
    }
    console.log(error);
  }
});

app.get("/signout", (req, res, next) => {
  //Signout
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

// POST a new todo
app.post("/todos", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
  console.log("Creating a todo", req.body);
  console.log(req.user);
  try {
    await Todo.addTodo({
      title: req.body.title,
      dueDate: req.body.dueDate,
      userId: req.user.id,
    });
    return res.redirect("/todos");
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      error.errors.forEach((e) => req.flash("error", e.message));
      return res.redirect("/todos");
    }
    console.log(error);
    return res.status(422).json(error);
  }
});

// PUT: Mark a todo as completed
// put http://mytodoapp.com/todos/123/markAsCompleted
app.put("/todos/:id", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
  console.log("we have to update a todo woth ID:", req.params.id);
  const todo = await Todo.findByPk(req.params.id);

  try {
    const updatedTodo = await todo.markAsCompleted();
    return res.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return res.status(422).json(error);
  }
});
// DELETE a todo
app.delete(
  "/todos/:id",
  connectEnsureLogin.ensureLoggedIn(),
  async (req, res) => {
    console.log("Delete a todo by ID: ", req.params.id);
    try {
      await Todo.remove(req.params.id, req.user.id);
      return res.json({ sucess: true });
    } catch (error) {
      console.log(error);
      return res.status(422).json(error);
    }
  },
);

module.exports = app;
