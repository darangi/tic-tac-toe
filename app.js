const express = require('express');
const cors = require('cors');
const logger = require('morgan');
const ip = require('ip');
const socket = require('./scripts/socket');
const routes = require('./routes/index');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use('/', routes);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`IP address ${ip.address()}:${port}`);

  socket.initialize(server);
});

module.exports = server;
