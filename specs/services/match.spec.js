/* eslint-disable no-undef */
const matches = require('../../services/matches');
const Match = require('../../services/match');
const { generateId } = require('../../scripts/utils');

describe('Matches', () => {
  let match;
  const defaultBoard = [['', '', ''], ['', '', ''], ['', '', '']];
  const [firstPlayer, secondPlayer, thirdPlayer] = [1, 2, 3].map(() => generateId());

  it('Should create a match if non is available', () => {
    match = matches.findAvailableMatch();

    expect(match).toBeNull();

    match = new Match();
    matches.addMatch(match);

    const result = matches.findAvailableMatch();

    expect(result).not.toBeNull();
    expect(result.getMatchId()).toBe(match.getMatchId());
  });

  it('Should find a created match', () => {
    const result = matches.getMatch(match.getMatchId());

    expect(result.getMatchId()).toBe(match.getMatchId());
  });

  it('Should add player to match and allow only 2 players per match', () => {
    match.join(firstPlayer);
    match.join(secondPlayer);

    let players = match.getPlayers();

    expect(players).toContain(firstPlayer);
    expect(players).toContain(secondPlayer);
    expect(match.filled()).toBeTruthy();

    const result = match.join(thirdPlayer);

    expect(result).toBeNull();

    players = match.getPlayers();

    expect(players).not.toContain(thirdPlayer);
    expect(players.length).toBe(2);
  });

  it('Match should have a default board', () => {
    const { board } = match.getBoard();
    expect(board).toEqual(defaultBoard);
  });

  it('Match Should have 2 players, X and O', () => {
    const { players } = match.getBoard();
    expect(Object.values(players).sort()).toEqual(['X', 'O'].sort());
  });

  it('Matches should be able to track player history', () => {
    expect(matches.isPlayerNew(firstPlayer)).toBeFalsy();

    const newPlayerId = generateId();
    const anotherMatch = new Match();

    expect(matches.isPlayerNew(newPlayerId)).toBeTruthy();

    anotherMatch.join(newPlayerId);

    expect(matches.isPlayerNew(newPlayerId)).toBeFalsy();
  });

  it('Should allow multiple matches', () => {
    expect(Object.keys(matches.getAll()).length).toBe(1);

    const newMatch = new Match();
    matches.addMatch(newMatch);

    expect(match.getMatchId()).not.toBe(newMatch.getMatchId());
    expect(Object.keys(matches.getAll()).length).toBeGreaterThan(1);
  });
});
