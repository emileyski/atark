const { Strategy: GithubStrategy } = require("passport-github2");
const User = require("../models/User");
const getTokens = require("../utils");
const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = require("../credentials");

const githubStrategy = new GithubStrategy(
  {
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback",
    session: false,
    scope: ["profile", "user:email"],
  },
  async function (accessToken, refreshToken, profile, done) {
    if (!profile || !profile.id) {
      return done(new Error("Github profile ID not found"), null);
    }

    // console.log(profile);
    // return done(null, profile);

    try {
      let user = await User.findOne({ providerId: profile.id });

      if (user) {
        // Если пользователь существует, обновите его данные из profile._json и сохраните в базе данных
        user.displayName = profile.displayName;
        user.email = profile.emails[0].value;
        // Дополните данными из profile._json, если это необходимо

        await user.save();
      } else {
        user = new User({
          providerName: "github", // Установите соответствующий провайдер
          providerId: profile.id,
          displayName: profile.displayName,
          email: profile.emails[0].value,
          // Дополните данными из profile._json, если это необходимо
        });

        await user.save();
      }

      const { accessToken, refreshToken } = getTokens(user);

      return done(null, {
        accessToken,
        refreshToken,
        userData: user,
      });
    } catch (error) {
      return done(error, null);
    }
  }
);

module.exports = githubStrategy;
