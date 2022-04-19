import { PassportStatic } from "passport";
import { Strategy } from "passport-local";
import { createUser, getUserByEmail } from "../controller/User.controller";

// Sign up
export const signup = async (passport: PassportStatic) => {
  passport.use(
    "signup",
    new Strategy(
      {
        usernameField: "email",
        passwordField: "password"
      },
      async (email, password, done) => {
        try {
          const user = await getUserByEmail(email);
          if (user) {
            return done(null, false, { message: "User already exists" });
          }
          const newUser = await createUser(email, password);
          return done(null, newUser);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

// Login
export const login = async (passport: PassportStatic) => {
  passport.use(
    "login",
    new Strategy(
      {
        usernameField: "email",
        passwordField: "password"
      },
      async (email, password, done) => {
        try {
          const user = await getUserByEmail(email);
          if (!user) {
            return done(null, false, { message: "User does not exist" });
          }
          if (user.password !== password) {
            return done(null, false, { message: "Incorrect password" });
          }
          return done(null, user, { message: "Logged in successfully" });
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};
