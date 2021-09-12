// These can be replaced with a database like mongo, redis, etc

let matches = {};

let boards = {};

const findMatch = (matchId) => matches[matchId];

const findAvailableMatch = () => {
  let availableMatch;

  Object.keys(matches).forEach((match) => {
    const { players } = findMatch(match);

    if (players && players.length < 2) {
      availableMatch = match;
    }
  });

  return availableMatch;
};

const createMatch = ({ matchId, playerId }) => {
  matches[matchId] = { players: [playerId] };

  return matchId;
};

const addPlayerToMatch = ({ matchId, playerId }) => {
  const match = findMatch(matchId);

  if (match && match.players) {
    match.players.push(playerId);
  } else {
    createMatch({ matchId, playerId });
  }

  return matchId;
};

const joinMatch = ({ matchId, playerId }) => {
  const availableMatch = findAvailableMatch() || matchId;

  return addPlayerToMatch({ matchId: availableMatch, playerId });
};

const updateMatch = (matchId, data) => {
  const match = findMatch(matchId);

  matches[matchId] = { match, ...data };

  return match;
};

const findBoard = (matchId) => boards[matchId];

const createBoard = ({ playerId, matchId }) => {
  const playerPiece = ['X', 'O'][Math.floor(Math.random() * 2)];

  const board = {
    players: { [playerId]: playerPiece },
    board: [['', '', ''], ['', '', ''], ['', '', '']],
  };

  boards[matchId] = board;

  return boards[matchId];
};

const joinBoard = ({ playerId, matchId }) => {
  const board = findBoard(matchId);

  if (!board) {
    return createBoard({ playerId, matchId });
  }

  const { players } = findMatch(matchId);
  const opponentPiece = board.players[players[0]];
  const playerPiece = opponentPiece === 'O' ? 'X' : 'O';
  board.players[playerId] = playerPiece;

  return board;
};

const updateMove = ({
  matchId, player, row, column,
}) => {
  const board = findBoard(matchId);

  if (board.board[row][column]) {
    return false;
  }

  board.board[row][column] = player;
  board.lastMove = player;

  return board;
};

const resetGame = () => {
  boards = {};
  matches = {};
};
module.exports = {
  createMatch,
  findMatch,
  joinMatch,
  updateMatch,
  findAvailableMatch,
  createBoard,
  joinBoard,
  findBoard,
  updateMove,
  resetGame,
};
