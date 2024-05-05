import express, { NextFunction, Request, Response } from 'express';
import session from 'express-session';
import jwt from 'jsonwebtoken';
import Redis from 'ioredis';
import cookieParser from 'cookie-parser';
import User from './models/user';

import userRoute from './routes/users-route';

interface RequestWithUsername extends Request {
  username?: string;
}

const app = express();
const port = 3000;
const redis = new Redis();

app.use(express.static('static'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
  secret: 'System of a Down',
  resave: false,
  saveUninitialized: false
}));

app.use(userRoute);

const generateAccessToken = (username: string) => {
  return jwt.sign({ username }, 'System of a Down', { expiresIn: '10m' });
};

const generateRefreshToken = (username: string) => {
  return jwt.sign({ username }, 'lol', { expiresIn: '24h' });
};

const isAuth = (req: RequestWithUsername, res: Response, next: NextFunction) => {
  const accessToken = req.cookies.accessToken;

  jwt.verify(accessToken, 'System of a Down', (err: any, decoded: any) => {
    if (err) {
      return res.sendStatus(401);
    }

    req.username = decoded.username;
    next();
  });
};

const isUnauth = (req: RequestWithUsername, res: Response, next: NextFunction) => {
  const accessToken = req.cookies.accessToken;

  if (accessToken) {
    res.redirect('/');
    return;
  }

  jwt.verify(accessToken, 'System of a Down', (err: any, decoded: any) => {
    if (err) {
      req.username = decoded?.username;
      next();
      return;
    } else {
      return res.sendStatus(400).redirect('/');
    }
  });
};

app.get('/register', isUnauth, (req: RequestWithUsername, res: Response) => {
  res.sendFile('register.html', { root: __dirname + '/static/' });
});

app.post('/register', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const isUserExists = await User.findFirst({
    where: {
      username: username
    }
  });

  if (isUserExists) {
    res.status(400).end(`User '${username}' is already exists`);
    return;
  }

  const user = await User.create({
    data: {
      username: username,
      password: password,
      role: "user",
      email: "email@email.com"
    }
  });

  res.redirect('/');
})

app.get('/login', isUnauth, (req: RequestWithUsername, res: Response) => {
  res.sendFile('form.html', { root: __dirname + '/static/' });
});

app.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const user = await User.findFirst({
    where: {
      username: username,
      password: password
    }
  });

  if (user) {
    const accessToken = generateAccessToken(user.username);
    const refreshToken = generateRefreshToken(user.username);

    res.cookie('accessToken', accessToken, { httpOnly: true, sameSite: 'strict'});
    res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict', path: '/refresh-token' });

    res.redirect('/');
  } else {
    res.redirect('/login');
  }
});

app.get('/refresh-token', (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  
  if (refreshToken.length == 0) {
    return res.sendStatus(401);
  }

  jwt.verify(refreshToken, 'lol', (err: any, decoded: any) => {
    if (err) {
      return res.sendStatus(401);
    }

    const username = decoded.username;
    const newAccessToken = generateAccessToken(username);
    const newRefreshToken = generateRefreshToken(username);

    redis.set('blacklist', refreshToken);

    res.cookie('accessToken', newAccessToken, { httpOnly: true, sameSite: 'strict' });
    res.cookie('refreshToken', newRefreshToken, { httpOnly: true, sameSite: 'strict', path: '/refresh-token' });

    res.redirect('/resource');
  });
});

app.get('/logout', (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    redis.sadd('blacklist', refreshToken);
  }

  res.clearCookie('accessToken', {
    path: '/'
  });
  res.clearCookie('refreshToken', {
    path: '/'
  });

  res.status(200).redirect('/');
});

app.get('/resource', isAuth, (req : RequestWithUsername, res: Response) => {
  res.json(req.username);
});

app.use((_, res: Response) => {
  res.status(404).send('Page not found');
});

app.listen(port, () => {
  console.log(`Server is running on ${port} port`);
});