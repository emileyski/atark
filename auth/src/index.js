const express = require("express");
const passport = require("passport");
const mongoose = require("mongoose");
const { MONGO_URL } = require("./credentials");
const googleStrategy = require("./strategies/google.strategy");
const localStrategy = require("./strategies/local.strategy");
var cookieParser = require("cookie-parser");
const githubStrategy = require("./strategies/github.strategy");
const router = require("./routes");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

passport.use(googleStrategy);
passport.use(localStrategy);
passport.use(githubStrategy);

app.use("/auth", router);

const PORT = 3000;

const start = async () => {
  await mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  app.listen(PORT, () => {
    console.log(`Auth service is running at ${PORT}`);
  });
};

start();
