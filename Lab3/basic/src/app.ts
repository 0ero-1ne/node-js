import express, { Request, Response, NextFunction } from "express";
import session from "express-session";
import path from "path";
import passport from "./passport-basic";

const app = express();
const port : number = 3000;
let logout : boolean = false;

app.use(express.static('static'));
app.use(session({
    secret: 'system of a down',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname + '/../static/index.html'));
});

app.get('/login',
    (req : Request, res : Response, next : NextFunction) => {
        if (req.headers.authorization && logout) {
            logout = false;
            delete req.headers.authorization;
        }
        next();
    }, passport.authenticate('basic', { session: true, successRedirect: '/'}),   
);

app.get('/logout', (req : Request, res : Response) => {
    req.logOut((err) => {});
    res.status(200).clearCookie('connect.sid', {
        path: '/'
    });
    logout = true;
    res.redirect('/');
});

app.get('/resource', (req : Request, res : Response) => {
    if (req.user) {
        res.json(req.user);
        return;
    } else {
        res.redirect('/login');
    }
});

app.get('/user', (req : Request, res : Response) => {
    res.json(req.user === undefined ? {} : req.user);
})

app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname + '/../static/404.html'));
});

app.listen(port, () => {
    console.log(`Server started: localhost:${port}`)
});