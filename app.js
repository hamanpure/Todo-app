const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());

const { Todo } = require("./models");

// eslint-disable-next-line no-unused-vars
app.get("/todos", (req, res) => {
  // res.send("Hello World!")
  console.log("Todo list");
});

app.post("/todos", async (req, res) => {
  console.log("Creating a todo", req.body);
  //Todo
  try {
    const todo = await Todo.addTodo({
      title: req.body.title,
      dueDate: req.body.dueDate,
    });
    return res.json(todo);
  } catch (error) {
    console.log(error);
    return res.status(422).json(error);
  }
});

// put http://mytodoapp.com/todos/123/markAsCompleted
app.put("/todos/:id/markAsCompleted", async (req, res) => {
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

// eslint-disable-next-line no-unused-vars
app.delete("/todos/:id", (req, res) => {
  console.log("Delete a todo by ID: ", req.params.id);
});

module.exports = app;
