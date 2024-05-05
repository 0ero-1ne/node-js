import express from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import session from 'express-session';
import client_secret from "./client_secret.json";

const app = express();

passport.use(new GoogleStrategy({
    clientID: client_secret.web.client_id as string,
    clientSecret: client_secret.web.client_secret as string,
    callbackURL: client_secret.web.redirect_uris[0] as string
},
    (accessToken, refreshToken, profile, done) => {
        done(null, profile);
    }
));

declare global {
    namespace Express {
        interface User extends Profile { } // Объявляем тип User, расширяя его до типа Profile
    }
}

app.use(express.static('static'));
app.use(session({
    secret: 'System of a Down',
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done: (err: any, id?: any) => void) => {
    done(null, user);
});

passport.deserializeUser((obj, done: (err: any, id?: any) => void) => {
    done(null, obj);
});

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname });
});

app.get('/login', (req, res) => {
    res.sendFile('login.html', { root: __dirname + '/static/' });
});

app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login', successRedirect: '/resource' })
);

app.get('/logout', (req, res) => {
    req.logout((er) => console.log(er));
    res.redirect('/');
});

app.get('/resource', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ userId: req.user.id, displayName: req.user.displayName });
    } else {
        res.redirect('/login');
    }
});

app.get('/json-resources', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ displayName: req.user.displayName });
        return;
    }

    res.json([]);
});

app.get('*', (req, res) => {
    res.sendFile('404.html', { root: __dirname + '/static/' });
});


app.listen(3000, () => {
    console.log('Server listening on port 3000');
});
