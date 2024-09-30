/* eslint-disable no-undef */
const request = require("supertest");
var cheerio = require("cheerio");
const db = require("../models/index");
const app = require("../app");
// const { Passport } = require("passport");

let server, agent;
function extractCsrfToken(res) {
  var $ = cheerio.load(res.text);
  return $("[name=_csrf]").val();
}

const login = async (agent, username, password) => {
  let res = await agent.get("/login");
  let csrfToken = extractCsrfToken(res);
  res = await agent.post("/session").send({
    email: username,
    password: password,
    _csrf: csrfToken,
  });
};

describe("Todo test suite", () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(4000, () => {});
    agent = request.agent(server);
  });

  afterAll(async () => {
    await db.sequelize.close();
    server.close();
  });

  test("Sign up", async () => {
    let res = await agent.get("/signup");
    const csrfToken = extractCsrfToken(res);
    res = await agent.post("/users").send({
      firstNmae: "Test",
      lastName: "User A",
      email: "user.atest@test.com",
      password: "12345678",
      _csrf: csrfToken,
    });
    expect(res.statusCode).toBe(302);
  });

  test("Sign Out", async () => {
    let res = await agent.get("/todos");
    expect(res.statusCode).toBe(200);
    res = await agent.get("/signout");
    expect(res.statusCode).toBe(302);
    res = await agent.get("/todos");
    expect(res.statusCode).toBe(302);
  });

  test("create a new todo", async () => {
    const agent = request.agent(server);
    await login(agent, "user.atest@test.com", "12345678");
    const res = await agent.get("/todos");
    const csrfToken = extractCsrfToken(res);
    const response = await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });
    expect(response.statusCode).toBe(302);
  });

  test("Mark a todo as complete or incomplete with given id", async () => {
    const agent = request.agent(server);
    await login(agent, "user.atest@test.com", "12345678");
    // Extract CSRF token
    let res = await agent.get("/todos");
    let csrfToken = extractCsrfToken(res);
    // Create a new todo
    await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });

    // Fetch all todos
    const groupedTodoResponse = await agent
      .get("/todos") // This fetches the todos from the /todos route, which returns them in JSON
      .set("Accept", "application/json");

    const parsedTodos = JSON.parse(groupedTodoResponse.text);

    console.log("parsedTodos:", parsedTodos); // Debugging
    // Check that there is at least one todo
    expect(parsedTodos.length).toBeGreaterThan(0);

    // Get the latest todo
    const latestTodo = parsedTodos[parsedTodos.length - 1];

    // Extract CSRF token again to mark the task as completed
    res = await agent.get("/todos");
    csrfToken = extractCsrfToken(res);

    // Mark the todo as complete
    let markCompletedResponse = await agent
      .put(`/todos/${latestTodo.id}`)
      .send({
        _csrf: csrfToken,
      });

    let parsedResponse = JSON.parse(markCompletedResponse.text);
    expect(parsedResponse.completed).toBe(true);

    // Mark the todo as incomplete again
    res = await agent.get("/todos");
    csrfToken = extractCsrfToken(res);

    markCompletedResponse = await agent.put(`/todos/${latestTodo.id}`).send({
      _csrf: csrfToken,
    });

    parsedResponse = JSON.parse(markCompletedResponse.text);
    expect(parsedResponse.completed).toBe(false);
  });

  test("test to check delete operation", async () => {
    const agent = request.agent(server);
    await login(agent, "user.atest@test.com", "12345678");
    let res = await agent.get("/todos");
    let csrfToken = extractCsrfToken(res);

    // Create a new todo
    await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });

    // Fetch all todos
    const groupedTodoResponse = await agent
      .get("/todos") // This fetches the todos from the /todos route, which returns them in JSON
      .set("Accept", "application/json");

    const parsedTodos = JSON.parse(groupedTodoResponse.text);

    // Check that there is at least one todo
    expect(parsedTodos.length).toBeGreaterThan(0);

    // Get the latest todo
    const latestTodo = parsedTodos[parsedTodos.length - 1];

    // Extract CSRF token again to mark the task as completed
    res = await agent.get("/todos");
    csrfToken = extractCsrfToken(res);
    const todoID = latestTodo.id;
    const deleted_value = await agent.delete(`/todos/${todoID}`);
    const d = deleted_value ? true : false;
    expect(d).toBe(true);
  });
});
