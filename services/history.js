class History {
    _players = [];

    isNewPlayer(playerId) {
        return !this._players.includes(playerId);
    }
    
    addPlayer(playerId) {
        this.isNewPlayer(playerId) && this._players.push(playerId);
    }
    
}

module.exports = History;