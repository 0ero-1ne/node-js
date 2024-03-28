import passport, { DoneCallback } from "passport";
import { BasicStrategy } from "passport-http";
import users, { IUser } from "./users";

passport.use(new BasicStrategy(
    function (_username : string, _password : string, done : DoneCallback) {
        try {
            const user = users.find(user => user.username === _username);

            if (!user) return done(null, false);
            if (user?.password !== _password) return done(null, false);

            return done(null, user);
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