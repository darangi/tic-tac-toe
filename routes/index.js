const express = require('express');

const router = express.Router();

const gameRoute = require('./game');

router.use('/', gameRoute);

module.exports = router;
