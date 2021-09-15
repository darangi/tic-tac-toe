const express = require('express');
const gameRoute = require('./game');

const router = express.Router();

router.use('/', gameRoute);

module.exports = router;
