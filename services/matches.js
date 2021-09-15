const History = require("./history");

class Matches {
 _matches = {}
 _history = []

 constructor() {
     this._history = new History();
 }
 
 getMatch(matchId) {
    return this._matches[matchId];
 }

 isPlayerNew(playerId) {
  return this._history.isNewPlayer(playerId)
 }

trackPlayer(playerId) {
  return this._history.addPlayer(playerId)
}

 getAll() {
    return this._matches;
}

 addMatch(match) {
     this._matches[match.getMatchId()] = match;
 }

 findAvailableMatch () {
     for(const matchId in this._matches) {
        const match = this.getMatch(matchId)
         if(match && match.getPlayers().length < 2) return match;
     }

     return null;
 }
}

module.exports = new Matches();
