const express = require('express');
const { start, move } = require('../controllers/game');

const router = express.Router();

router.post('/play', start);
router.post('/submitMove', move);

module.exports = router;
