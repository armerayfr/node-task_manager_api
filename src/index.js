const express = require("express");
require("./db/mongoose");
const userRouter = require("../src/routers/user");
const taskRouter = require("../src/routers/task");

const app = express();
const port = process.env.PORT;

app.use(express.json()); //parse JSON object
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log(`Server Running at ${port}`);
});
