class Board {
    _board = [['', '', ''], ['', '', ''], ['', '', '']];
    _players = {};
    _lastMove;

    getPlayers() {
        return this._players;
    }

    getPlayer(playerId) {
        return this._players[playerId];
    }

    getPlayerId(playerPiece) {
        for(const playerId in this._players) {
            if(playerPiece === this._players[playerId]) return playerId
        }
    }
    
    setPlayer(playerId) {
        this._players[playerId] = this._getPeiceToAssignPlayer();

        return playerId;
    }

    getBoard() {
       return this._board;
    }

    update({ row, column, player }) {
        if (this._board[row][column]) return false;

        this._board[row][column] = player;
        this._lastMove = player;

        return this._board;
    }

    _getFirstPlayerPiece() {
        return Object.values(this._players)[0]
    }

    getLastMove() {
        return this._lastMove;
    }


    getNextPlayerToMove() {
        return !this.getLastMove() ? this._getFirstPlayerPiece() : this.getLastMove()  === 'X' ? 'O' : 'X'
    }

    reset() {
        this._board = [['', '', ''], ['', '', ''], ['', '', '']];
        this._players = {};
        this._lastMove = null;
    }

    _getPeiceToAssignPlayer() {
        let piece = ['X', 'O'][Math.floor(Math.random() * 2)];
        if (!Object.keys(this._players).length) {
            return piece;
        }

        return this._getFirstPlayerPiece() === 'X' ? 'O' : 'X';
    }

}

module.exports = Board;
