"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const path_1 = __importDefault(require("path"));
const passport_basic_1 = __importDefault(require("./passport-basic"));
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.static('static'));
app.use((0, express_session_1.default)({
    secret: 'system of a down',
    resave: false,
    saveUninitialized: false
}));
app.use(passport_basic_1.default.initialize());
app.use(passport_basic_1.default.session());
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(__dirname + '/../static/index.html'));
});
app.get('/login', passport_basic_1.default.authenticate('basic', { session: true }), (req, res) => {
    if (req.user) {
        res.redirect('/');
        return;
    }
});
app.get('/logout', (req, res) => {
    req.logOut((err) => { });
    res.status(200).clearCookie('connect.sid', {
        path: '/'
    });
    res.redirect('/');
});
app.get('/resource', (req, res) => {
    if (req.user) {
        res.json(req.user);
        return;
    }
    else {
        res.redirect('/login');
    }
});
app.get('/user', (req, res) => {
    res.json(req.user === undefined ? {} : req.user);
});
app.get('*', (req, res) => {
    res.sendFile(path_1.default.join(__dirname + '/../static/404.html'));
});
app.listen(port, () => {
    console.log(`Server started: localhost:${port}`);
});
