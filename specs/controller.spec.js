/* eslint-disable no-undef */
const request = require('supertest');

const server = require('../app');
const socket = require('../scripts/socket');
const { resetGame } = require('../services/game');
const { generateId } = require('../scripts/utils');

describe('Game', () => {
  afterAll(async () => {
    server.close();
  });

  const socketSpy = jest.spyOn(socket, 'emit');

  const post = async (url, payload) => {
    const response = await request(server).post(url).send(payload);
    return response;
  };

  const start = (playerIds) => {
    const games = !playerIds ? [post('/play')] : playerIds.map((playerId) => post('/play', { playerId }));

    return Promise.all(games);
  };

  const submitMove = (move) => post('/submitMove', move);

  const getData = ({ body: { result } }, key) => {
    switch (key) {
      case 'players':
        return Object.keys(result[key]);
      case 'playerPiece':
        return result.players;

      default:
        return result[key];
    }
  };

  describe('POST: /play', () => {
    afterEach(resetGame);

    it('Should return status code 200', async () => {
      const playerIds = [generateId()];

      const [game] = await start(playerIds);

      expect(game.status).toBe(200);
    });

    it('Should return status code 400 when no playerId is passed', async () => {
      const [game] = await start();

      expect(game.status).toBe(400);

      expect(game.body.message).toContain('playerId');
    });

    it('Socket emits join to the client', async () => {
      const playerIds = [generateId()];

      const [game] = await start(playerIds);

      expect(socketSpy).toHaveBeenCalledWith('join', game.body.result);
    });

    it('Should allow 2 players per game', async () => {
      const playerIds = [1, 2, 3, 4].map(() => generateId());
      const [firstPlayer, secondPlayer, thirdPlayer, fourthPlayer] = playerIds;

      const [result1, result2, result3, result4] = await start(playerIds);

      const firstJoinPlayers = getData(result1, 'players');
      const secondJoinPlayers = getData(result2, 'players');
      const thirdJoinPlayers = getData(result3, 'players');
      const fourthJoinPlayers = getData(result4, 'players');

      const firstJoinMatchId = getData(result1, 'matchId');
      const secondJoinMatchId = getData(result2, 'matchId');
      const thirdJoinMatchId = getData(result3, 'matchId');
      const fourthJoinMatchId = getData(result4, 'matchId');

      expect(firstJoinMatchId).toEqual(secondJoinMatchId);

      expect(secondJoinMatchId).not.toEqual(thirdJoinMatchId);

      expect(firstJoinMatchId).not.toEqual(thirdJoinMatchId);

      expect(fourthJoinMatchId).toEqual(thirdJoinMatchId);

      expect(firstJoinPlayers.length).toBe(1);
      expect(firstJoinPlayers).toContain(firstPlayer);

      expect(secondJoinPlayers.length).toBe(2);
      expect(secondJoinPlayers).toEqual([firstPlayer, secondPlayer]);

      expect(firstJoinPlayers).toEqual(expect.not.arrayContaining([thirdPlayer, fourthPlayer]));
      expect(secondJoinPlayers).toEqual(expect.not.arrayContaining([thirdPlayer, fourthPlayer]));

      expect(thirdJoinPlayers.length).toBe(1);
      expect(thirdJoinPlayers).toContain(thirdPlayer);

      expect(fourthJoinPlayers.length).toBe(2);
      expect(fourthJoinPlayers).toEqual([thirdPlayer, fourthPlayer]);

      expect(thirdJoinPlayers).toEqual(expect.not.arrayContaining([firstPlayer, secondPlayer]));
      expect(fourthJoinPlayers).toEqual(expect.not.arrayContaining([firstPlayer, secondPlayer]));
    });

    it('Should allow either player to be X or O', async () => {
      const playerIds = [1, 2].map(() => generateId());
      const [firstPlayer, secondPlayer] = playerIds;

      const [result1, result2] = await start(playerIds);

      const firstPlayerPiece = getData(result1, 'playerPiece')[firstPlayer];
      const secondPlayerPiece = getData(result2, 'playerPiece')[secondPlayer];

      expect(firstPlayerPiece).not.toEqual(secondPlayerPiece);
    });
  });

  describe('POST: /submitMove', () => {
    const playerIds = [generateId(), generateId()];
    let match;
    let lastPlayerPiece;

    it('Should return status code 200', async () => {
      [firstPlayer, secondPlayer] = playerIds;

      [, match] = await start(playerIds);

      lastPlayerPiece = getData(match, 'playerPiece')[firstPlayer];

      const move = {
        player: lastPlayerPiece,
        row: 0,
        column: 0,
        matchId: getData(match, 'matchId'),
      };

      const response = await submitMove(move);

      expect(response.status).toBe(200);
    });

    it('Should return status code 400 when there are missing parameter(s)', async () => {
      const response = await submitMove();

      expect(response.status).toBe(400);

      expect(response.body.message).toContain('Missing field(s)');
    });

    it('Should return status code 401 when a player register another move before opponent makes a move', async () => {
      const move = {
        player: lastPlayerPiece,
        row: 0,
        column: 1,
        matchId: getData(match, 'matchId'),
      };

      const response = await submitMove(move);

      expect(response.status).toBe(401);
    });

    it('Should return status code 400 when a player tries to make a move in the same position', async () => {
      const move = {
        player: lastPlayerPiece === 'X' ? 'O' : 'X',
        row: 0,
        column: 0,
        matchId: getData(match, 'matchId'),
      };

      const response = await submitMove(move);

      expect(response.status).toBe(400);
    });

    it('Should emit submitMove to client', async () => {
      const move = {
        player: lastPlayerPiece === 'X' ? 'O' : 'X',
        row: 0,
        column: 1,
        matchId: getData(match, 'matchId'),
      };

      await submitMove(move);

      expect(socketSpy).toHaveBeenCalled();
    });
  });
});
