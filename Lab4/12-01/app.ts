import express, { NextFunction, Request, Response} from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy } from 'passport-local';
import users from './users';

const app = express();
const port = 3000;

app.use(session({
  secret: 'system of a down',
  resave: false,
  saveUninitialized: false
}));

app.use(express.static('static'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());
app.use(passport.session());


passport.use(new Strategy((username, password, done) => {
  const user = users.find((user: any) => user.username == username && user.password == password);

  if (user) {
    return done(null, user);
  }
    
  return done(null, false, { message: 'Wrong credentials' });
}));

passport.serializeUser((user: any, done) => {
  done(null, user.username);
});

passport.deserializeUser((username: string, done) => {
  const user = users.find((user: any) => user.username === username);
  done(null, user);
});

app.get('/', (_, res: Response) => {
  res.sendFile('index.html');
});

app.get('/login', (req: Request, res: Response) => {
  if (req.user != undefined) {
    res.redirect('/');
    return;
  }
  res.sendFile('form.html', { root: __dirname + '/static/' });
});

app.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' }));

app.get('/logout', (req: Request, res: Response) => {
  req.logout((err) => console.log(err));
  res.status(200).redirect('/');
});

app.get('/resource', (req: Request, res: Response) => {
  if (req.user) {
    res.status(200).json(req.user);
    return;
  }
  res.status(401).json([]);
});

app.use((_, res: Response) => {
  res.status(404).send('Page not found');
});

app.listen(port, () => {
  console.log(`Server is running on ${port} port`);
});