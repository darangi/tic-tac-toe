class Matches {
 _matches = {}
 _history = []

 getMatch(matchId) {
    return this._matches[matchId];
 }

 isPlayerNew(playerId) {
    return !this._history.includes(playerId)
 }

trackPlayer(playerId) {
    this.isPlayerNew(playerId) && this._history.push(playerId)
}

 getAll() {
    return this._matches;
}

 addMatch(match) {
     this._matches[match.getMatchId()] = match;
 }

 findMatchWithSingleOrNoPlayer () {
     for(const matchId in this._matches) {
        const match = this.getMatch(matchId)
         if(match && match.getPlayers().length < 2) return match;
     }

     return null;
 }
}

module.exports = new Matches();
