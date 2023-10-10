const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const User = require("../models/User");
const getTokens = require("../utils");
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = require("../credentials");

const googleStrategy = new GoogleStrategy(
  {
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback",
    session: false,
    // passReqToCallback: true,
    scope: ["profile", "email"],
  },
  async (googleAccessToken, googleRefreshToken, profile, done) => {
    if (!profile || !profile.id) {
      return done(new Error("Google profile ID not found"), null);
    }
    console.log(profile);
    try {
      let user = await User.findOne({ providerId: profile.id });

      if (user) {
        // Если пользователь существует, обновите его данные из profile._json и сохраните в базе данных
        user.displayName = profile.displayName;
        user.email = profile.emails[0].value;
        // Дополните данными из profile._json, если это необходимо

        await user.save();
      } else {
        // Если пользователь не существует, создайте новый инстанс пользователя и сохраните его в базе данных
        user = new User({
          providerName: "google", // Установите соответствующий провайдер
          providerId: profile.id,
          displayName: profile.displayName,
          email: profile.emails[0].value,
          // Дополните данными из profile._json, если это необходимо
        });

        await user.save();
      }

      //   console.log(user);

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

module.exports = googleStrategy;
