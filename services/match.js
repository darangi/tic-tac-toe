const { generateId } = require("../scripts/utils");
const Board = require("./board");
const matches = require("./matches");
const result = require("./result");
class Match {
  _players = []
  _board;
  _matchId;
  _currentPlayer;
  _lastUpdate;

  constructor() {
    this._matchId = generateId();
    this._board = new Board();
  }

  join(playerId) {
    if (this._players.length < 2) {
      this._players.push(playerId);
      this._currentPlayer = playerId;
      matches.trackPlayer(playerId);

      return this._board.setPlayer(playerId)
    }

    return null;
  }


  play({ player, row, column }) {
    const result = this._board.update({ player, row, column });
    if(result) {
      this._currentPlayer = this._board.getPlayerId(player);
    }
    
    this._lastUpdate = new Date().getTime();

    return result;
  }

  nextPlayerToMove() {
    return this._board.getNextPlayerToMove();
  }

  getBoard() {
    return {
      board: this._board.getBoard(),
      player: this._board.getPlayer(this._currentPlayer),
      turn: this._board.getNextPlayerToMove(),
      players: this._board.getPlayers(),
    };
  }
  
  lastMove() {
    return this._board.getLastMove()
  }

  getPlayers() {
    return this._players;
  }

  getMatchId() {
    return this._matchId;
  }

  state() {
    return { matchId: this._matchId, ...result.compute(this._board.getBoard()), ...this.getBoard() }
  }

  filled() {
    return this._players.length === 2;
  }

  reset() {
    this._board.reset();
    this._players = [];
    this._lastUpdate = null;
  }
}

module.exports = Match;