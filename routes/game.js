const express = require('express');

const router = express.Router();

const { start, move } = require('../controllers/game');

router.post('/play', start);
router.post('/submitMove', move);

module.exports = router;
