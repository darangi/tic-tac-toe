/* eslint-disable no-undef */
const service = require('../services/game');
const { generateId } = require('../scripts/utils');

describe('Service', () => {
  const matchId = generateId();

  it('Should create a match', () => {
    const playerId = generateId();
    const data = { matchId, playerId };

    const createMatchSpy = jest.spyOn(service, 'createMatch');

    service.createMatch(data);

    expect(createMatchSpy).toHaveBeenCalledWith(data);
  });

  it('Should find an available match', () => {
    const availableMatchSpy = jest.spyOn(service, 'findAvailableMatch');

    const availableMatch = service.findAvailableMatch();

    expect(availableMatchSpy).toHaveBeenCalled();

    expect(availableMatch).toBe(matchId);
  });

  it('Should join an exisiting match', () => {
    const playerId = generateId();
    const data = { matchId, playerId };

    const joinMatchSpy = jest.spyOn(service, 'joinMatch');

    service.joinMatch(data);

    expect(joinMatchSpy).toHaveBeenCalledWith(data);

    const match = service.findMatch(matchId);

    expect(match.players).toContain(playerId);

    expect(match.players.length).toEqual(2);
  });

  it('Should create a board', () => {
    const playerId = generateId();
    const data = { playerId, matchId };

    const createBoardSpy = jest.spyOn(service, 'createBoard');

    service.createBoard(data);

    expect(createBoardSpy).toHaveBeenCalledWith(data);

    const board = service.findBoard(matchId);

    expect(Object.keys(board.players)).toContain(playerId);
  });
});
