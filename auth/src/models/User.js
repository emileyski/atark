const { Schema, model } = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema(
  {
    providerName: {
      type: String,
      enum: ["local", "google", "github"],
      required: true,
      default: "local",
    },
    providerId: {
      type: String,
      required: false,
      unique: function () {
        return this.providerName !== "local";
      },
    },
    displayName: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: { type: String },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.salt;
      },
    },
  }
);

userSchema.set("versionKey", "version");

// Используйте passportLocalMongoose для поддержки локальной стратегии
userSchema.plugin(passportLocalMongoose, {
  usernameField: "email", // Здесь указывается, что поле email будет использоваться вместо username
  hashField: "password",
  errorMessages: {
    MissingPasswordError: "Password is required", // Специфичное сообщение об ошибке
  },
});

const User = model("User", userSchema);

module.exports = User;
