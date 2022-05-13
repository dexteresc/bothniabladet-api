import { Strategy, ExtractJwt, StrategyOptions } from "passport-jwt";
import { PassportStatic } from "passport";
import { pbkdf2 } from "crypto";
import { getUserByEmail, createUser } from "../controller/user.controller";
import { User } from "../models/User";


function initialize(passport: PassportStatic) {
  const opts: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeader(),
    secretOrKey: 'ligma-secret'
  };
  passport.use(
    new Strategy(opts, (jwtPayload, done) => {
      // Verify that id is a number
      if (typeof jwtPayload.id !== "number") {
        return done(null, false);
      }

      User.findOne({ where: { id: jwtPayload.id } })
        .then((user) => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch((err) => done(err, false));
        return false
      }
    ));
}

export const signUp = (email: string, password: string) => {
  const user = getUserByEmail(email);
  if (user) {
    throw new Error("User already exists");
  }
  if (!user) { // Signup dags
    pbkdf2(password, 'salt', 100000, 64, 'sha512', async (err, derivedKey) => {
      if (err) {
        throw err;
      }
      await createUser(email, derivedKey.toString('hex'));
    });
  }
  return false
};

export const logIn = async (email: string, password: string) => {
  const user = await getUserByEmail(email);
  if (!user) {
    throw new Error("User not found");
  }
  pbkdf2(password, 'salt', 100000, 64, 'sha512', async (err, derivedKey) => {
    if (err) {
      throw err;
    }
    if (derivedKey.toString('hex') === user.password) {
      return user;
    }
    throw new Error("Invalid password");
  });
  return null;
}