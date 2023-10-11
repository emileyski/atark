const { Router } = require("express");
const passport = require("passport");
const User = require("../models/User");
const getTokens = require("../utils");

const router = new Router();

router
  .post(
    "/signin",
    passport.authenticate("local", { session: false }),
    (req, res) => {
      // Вход выполнен успешно
      res.cookie("refreshToken", req.user.refreshToken, { httpOnly: true });

      res.json({
        accessToken: req.user.accessToken,
        refreshToken: req.user.refreshToken,
        userData: req.user.userData,
      });
    }
  )
  .post("/signup", async (req, res) => {
    try {
      const { email, displayName, password } = req.body;
      const user = new User({ email, displayName, providerName: "local" });
      await user.setPassword(password);
      await user.save();

      const { accessToken, refreshToken } = getTokens(user);

      res.cookie("refreshToken", refreshToken, { httpOnly: true });
      // Регистрация выполнена успешно
      res.status(201).json({ accessToken, refreshToken, userData: user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

module.exports = { localStrategyRouter: router };
