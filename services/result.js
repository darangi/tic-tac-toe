class Result {
  board = null;

  winner() {
    // improvement, use a better algorithm

    if(!this.board) return;

    let winner = null;

    // diagonal
    if (this.board[0][0] === this.board[1][1] && this.board[1][1] === this.board[2][2]) {
      winner = this.board[0][0];
    }
    // anti-diagonal
    if (this.board[2][0] === this.board[1][1] && this.board[1][1] === this.board[0][2]) {
      winner = this.board[2][0];
    }

    if (winner) return winner;

    for (let i = 0; i < 3; i += 1) {
      // vertical
      if (this.board[0][i] === this.board[1][i] && this.board[1][i] === this.board[2][i]) {
        winner = this.board[0][i];
      }
      // horizontal
      if (this.board[i][0] === this.board[i][1] && this.board[i][1] === this.board[i][2]) {
        winner = this.board[i][0];
      }
    }

    return winner;
  };

  _totalMoves() {
    return this.board && [].concat(...this.board).filter((position) => position !== '').length;
  }

  result(board) {
    this.board = board;
    const winner = this.winner();
    return {
      gameOver: !!winner || this._totalMoves() === 9,
      winner,
    };
  };
}

module.exports = Result;