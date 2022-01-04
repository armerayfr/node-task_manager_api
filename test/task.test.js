const request = require("supertest");
const app = require("../src/app");
const Task = require("../src/models/task");
const {
  userOneId,
  userOne,
  userTwo,
  taskOne,
  setupDatabase,
} = require("./fixtures/db");

beforeEach(setupDatabase);

test("Should add new task", async () => {
  const response = await request(app)
    .post("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: "Go to supermarket",
    })
    .expect(201);
  const task = await Task.findById(response.body._id);
  expect(task).not.toBeNull; //assert that the database was changed correctly
  expect(task.completed).toEqual(false); //assert that the completed object false
});

test("Should get Tasks by userOne", async () => {
  const response = await request(app)
    .get("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
  expect(response.body.length).toBe(2);
});

test("Should userTwo does not delete task userOne", async () => {
  await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404);

  const task = await Task.findById(taskOne._id);
  expect(task).not.toBeNull();
});
