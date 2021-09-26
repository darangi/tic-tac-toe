const socket = require('../services/socket');
const Match = require('../services/match');
const matches = require('../services/matches');
const { validateRequest } = require('../scripts/utils');

const start = (req, res) => {
  try {
    const { playerId } = req.body;
    // Improvement: use a validator middleware
    if (!playerId) {
      return res.status(400).send({ message: 'Missing field, playerId' });
    }

    let match = matches.findMatchWithSingleOrNoPlayer();
    if (!match) {
      match = new Match();
      matches.addMatch(match);
    }
    match.join(playerId);

    socket.emit('join', {
      matchId: match.getMatchId(),
      player: playerId,
      players: match.getPlayers(),
      isNewUser: matches.isPlayerNew(playerId),
    });

    return res.send({ result: match.state() });
  } catch (ex) {
    return res.status(500).send({ result: 'An error occured' });
  }
};

const move = (req, res) => {
  try {
    const missingFields = validateRequest(req.body);
    if (missingFields) {
      return res.status(400).send({ message: missingFields });
    }

    const {
      matchId, row, column, player,
    } = req.body;

    const match = matches.getMatch(matchId);
    if (!match) {
      return res.status(404).send({ message: 'Match does not exist' });
    }

    if (match.lastMove() === player || match.nextPlayerToMove() !== player) {
      return res.status(400).send({ result: false });
    }

    const success = match.play({ player, row, column });
    if (!success) {
      return res.status(400).send({ message: 'Unable to register move' });
    }

    socket.emit('submitMove', match.state());

    return res.send({ result: true });
  } catch (ex) {
    return res.status(500).send({ result: 'An error occured' });
  }
};

module.exports = {
  start,
  move,
};
