/* eslint-disable prefer-destructuring */
const generateId = () => Math.random().toString(36).substring(2, 15)
 + Math.random().toString(36).substring(2, 15);

const findMatchWinner = (board) => {
  // improvement, use a better algorithm

  let winner = null;
  for (let i = 0; i < 3; i += 1) {
    // vertical
    if (board[0][i] === board[1][i] && board[1][i] === board[2][i]) {
      winner = board[0][i];
    }
    // horizontal
    if (board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
      winner = board[i][0];
    }
    // diagonal
    if (board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
      winner = board[0][0];
    }
    // anti-diagonal
    if (board[2][0] === board[1][1] && board[1][1] === board[0][2]) {
      winner = board[2][0];
    }
  }

  return winner;
};

const matchStatus = ({ board }) => {
  const totalMoves = [].concat(...board).filter((playerPiece) => playerPiece !== '').length;

  const winner = findMatchWinner(board);
  const gameOver = !!winner || totalMoves === 9;

  return {
    gameOver,
    winner,
  };
};

const validateRequest = (requiredFields, expectedFields) => {
  const result = requiredFields.filter((field) => !expectedFields.includes(field));

  return result.join(', ');
};

module.exports = {
  generateId,
  matchStatus,
  validateRequest,
};
