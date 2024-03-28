import passport from "passport";
import { DigestStrategy } from "passport-http";
import users, { IUser } from "./users";

passport.use(new DigestStrategy(
    function (_username : string, done) {
        try {
            const user = users.find(user => user.username === _username);

            if (!user) return done(null, false);

            return done(null, user, user.password);
        } catch(err) {
            done(err);
        }
    }
));

passport.serializeUser((_user, done) => {
    done(null, _user);
});

passport.deserializeUser((_user : IUser, done) => {
    const user = users.find(user => user?.username === _user?.username);
    done(null, user);
});

export default passport;