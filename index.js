const express = require('express');
const bodyParser = require('body-parser');

const userRouter = require('./routes/users');
const teacherRouter = require('./routes/teachers');
const courseRouter = require('./routes/courses');
const studentRouter = require('./routes/students');

const app = express();

const baseApi = "/api/v1";

app.use(bodyParser.json());
 
app.get(baseApi, function (req, res) {
  res.send('Hello World!');
});

// Rotas da Tarefa 02
app.use(`${baseApi}/user`, userRouter);
app.use(`${baseApi}/teacher`, teacherRouter);
app.use(`${baseApi}/course`, courseRouter);
app.use(`${baseApi}/student`, studentRouter);
 
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on PORT ${listener.address().port}`);
});
