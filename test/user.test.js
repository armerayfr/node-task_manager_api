const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");

const { userOneId, userOne, setupDatabase } = require("./fixtures/db");

beforeEach(setupDatabase);

test("should sign up", async () => {
  const respone = await request(app)
    .post("/users")
    .send({
      name: "Armer",
      email: "armerray@gmail.com",
      password: "call912",
    })
    .expect(201);

  //assert that the database was changed correctly
  const user = await User.findById(respone.body.user._id);
  expect(user).not.toBeNull();

  //assertions about response
  expect(respone.body).toMatchObject({
    user: {
      name: "Armer",
      email: "armerray@gmail.com",
    },
    token: user.tokens[0].token,
  });

  //assert password not store in plain text
  expect(user.password).not.toBe("call912");
});

test("should login existent user", async () => {
  const respone = await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);

  const user = await User.findById(userOneId);
  expect(respone.body.token).toBe(user.tokens[1].token);
});

test("should not login nonexistent user", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: "password",
    })
    .expect(400);
});

test("should get profile for user", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should not get profile for user", async () => {
  await request(app).get("/users/me").send().expect(401);
});

test("Should delete account for user", async () => {
  await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  const user = await User.findById(userOneId);

  //assert user is removed
  expect(user).toBeNull();
});

test("Should not delete account for user", async () => {
  await request(app).delete("/users/me").send().expect(401);
});

test("Should upload avatar image", async () => {
  await request(app)
    .post("/users/me/avatar")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .attach("avatar", "test/fixtures/profile-pic.jpg")
    .expect(200);

  //asert in expect value is Buffer
  const user = await User.findById(userOneId);
  expect(user.avatar).toEqual(expect.any(Buffer));
});

test("Should update valid user fields", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: "Emma",
    })
    .expect(200);

  //asert data changed
  const user = await User.findById(userOneId);
  expect(user.name).toEqual("Emma");
});

test("Should not update invalid user fields", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      hobby: "Web Development",
    })
    .expect(400);
});
