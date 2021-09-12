const socket = require('../scripts/socket');
const service = require('../services/game');

const { generateId, matchStatus, validateRequest } = require('../scripts/utils');

const start = async (req, res) => {
  try {
    const { playerId } = req.body;

    // Improvement: use a validator middleware
    if (!playerId) {
      return res.status(400).send({ message: 'Missing field, playerId' });
    }

    const matchId = service.joinMatch({ matchId: generateId(), playerId });
    const board = service.joinBoard({ matchId, playerId });

    const turn = board.players[playerId];

    const result = {
      player: board.players[playerId],
      matchId,
      turn,
      ...board,
    };

    socket.emit('join', result);

    return res.send({ result });
  } catch (ex) {
    return res.status(500).send({ result: 'An error occured' });
  }
};

const move = async (req, res) => {
  try {
    const {
      matchId, row, column, player,
    } = req.body;

    // Improvement: use a validator middleware
    const requiredFields = ['matchId', 'row', 'column', 'player'];
    const expectedFields = Object.keys(req.body);
    const missingFields = validateRequest(requiredFields, expectedFields);

    if (missingFields) {
      return res.status(400).send({ message: `Missing field(s), ${missingFields}` });
    }

    let board = service.findBoard(matchId);

    if (board?.lastMove && board.lastMove === player) {
      return res.status(401).send({ result: false });
    }

    board = service.updateMove({
      matchId, player, row, column,
    });

    if (!board) {
      return res.status(400).send({ message: 'Unable to register move' });
    }

    const { gameOver, winner } = matchStatus(board);

    if (gameOver || winner) {
      service.updateMatch(matchId, { gameOver, winner });
    }

    const result = {
      ...board,
      player,
      matchId,
      gameOver,
      winner,
      turn: player === 'X' ? 'O' : 'X',
    };

    socket.emit('submitMove', result);

    return res.send({ result: true });
  } catch (error) {
    return res.status(500).send({ result: 'An error occured' });
  }
};

module.exports = {
  start,
  move,
};
