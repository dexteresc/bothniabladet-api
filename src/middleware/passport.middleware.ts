import { Strategy, ExtractJwt, StrategyOptions } from "passport-jwt";
import { PassportStatic } from "passport";
import { User } from "../models/User";

export default (passport: PassportStatic) => {
  const opts: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
  };
  passport.use(
    new Strategy(opts, (jwtPayload, done) => {
      User.findOne({ where: { id: jwtPayload.user.id } })
        .then(
          (user) => {
            if (user) {
              return done(null, user);
            }
            return done(null, false);
          },
          (err) => done(err, false)
        )
        .catch((err) => done(err, false));
    })
  );
};
