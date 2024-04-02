// app.js
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const routes = require('./routes');
const errorController = require('./controllers/errorController');
const config = require('./config');

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('combined'));

app.use((req, res, next) => {
  res.locals.profile = config.profile;
  next();
});

app.use('/', routes);

app.use(errorController.get404);
app.use(errorController.handleErrors);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
