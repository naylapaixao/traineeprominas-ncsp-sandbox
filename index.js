// require("dotenv-safe").load();
// var jwt = require('jsonwebtoken');
const express = require('express');
const bodyParser = require('body-parser');

const userRouter = require('./routes/users');
const teacherRouter = require('./routes/teachers');
const courseRouter = require('./routes/courses');
const studentRouter = require('./routes/students');
// const loginRouter = require('./routes/login');

const app = express();

const conn = require('./config');
const cors = require('cors');

var jwt = require('express-jwt');
var jwks = require('jwks-rsa');

conn();

var jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: 'https://dev-xsfon-m5.auth0.com/.well-known/jwks.json'
}),
audience: 'Trainee',
issuer: 'https://dev-xsfon-m5.auth0.com/',
algorithms: ['RS256']
});



const baseApi = "/api/v1";
const baseApiSecure = "/api/v1.1";

app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());

app.get(baseApi, function (req, res) {
  res.json('NodeJs Trainee!');
});

// Rotas da Tarefa 02
app.use(`${baseApi}/user`, userRouter);
app.use(`${baseApi}/JSON/user`, userRouter);

app.use(`${baseApi}/teacher`, teacherRouter);
app.use(`${baseApi}/JSON/teacher`, teacherRouter);

app.use(`${baseApi}/course`, courseRouter);
app.use(`${baseApi}/JSON/course`, courseRouter);

app.use(`${baseApi}/student`, studentRouter);
app.use(`${baseApi}/JSON/student`, studentRouter);

//Routes 1.1
app.use(`${baseApiSecure}/user`, jwtCheck, userRouter);
app.use(`${baseApiSecure}/JSON/user`,jwtCheck, userRouter);

app.use(`${baseApiSecure}/teacher`, jwtCheck,teacherRouter);
app.use(`${baseApiSecure}/JSON/teacher`, jwtCheck, teacherRouter);

app.use(`${baseApiSecure}/course`, jwtCheck, courseRouter);
app.use(`${baseApiSecure}/JSON/course`, jwtCheck, courseRouter);

app.use(`${baseApiSecure}/student`, jwtCheck,studentRouter);
app.use(`${baseApiSecure}/JSON/student`, jwtCheck, studentRouter);

app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('invalid token...');
  }
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on PORT ${listener.address().port}`);
});

module.exports = app;