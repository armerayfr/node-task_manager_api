const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_PORT, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false, //remove deprecated method warning
});
