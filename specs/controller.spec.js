/* eslint-disable no-undef */
const request = require('supertest');
const server = require('../app');
const socket = require('../services/socket');
const { generateId } = require('../scripts/utils');

class RequestFormatter {
  _data;

  constructor(data) {
    this._data = data.body.result
  } 

  get players() {
    return  Object.keys(this._data.players);
  }

  get matchId() {
    return this._data.matchId;
  }

  playerPiece(playerId) {
      return this._data.players[playerId]
  }

}

describe('Game', () => {
  const socketSpy = jest.spyOn(socket, 'emit');

  const post = async (url, payload) => request(server).post(url).send(payload);

  const singleRequest = (data) => post('/play', data);
  
  const multipleRequests = (playerIds) => {
    const games = playerIds.map((playerId) => post('/play', { playerId }));

    return Promise.all(games);
  };

  const submitMove = (move) => post('/submitMove', move);

  describe('POST: /play', () => {
    afterEach(async () => {
      server.close();
    });

    it('Should return status code 200', async () => {
      const response = await singleRequest({ playerId: generateId() });
      expect(response.status).toBe(200);
    });

    it('Should return status code 400 when no playerId is passed', async () => {
      const response = await singleRequest();

      expect(response.status).toBe(400);

      expect(response.body.message).toContain('playerId');
    });

    it('Socket emits join to the client', async () => {
      await singleRequest({ playerId: generateId() });

      expect(socketSpy).toHaveBeenCalledWith('join', expect.anything());
    });

    it('Should allow multiple matches and 2 players per match', async () => {
      const playerIds = [1, 2, 3, 4].map(() => generateId());
      const [firstPlayer, secondPlayer, thirdPlayer, fourthPlayer] = playerIds;

      const [first, second, third, fourth] = await multipleRequests(playerIds);

      const firstRequest = new RequestFormatter(first);
      const secondRequest  = new RequestFormatter(second);
      const thirdRequest  = new RequestFormatter(third);
      const fourthRequest  = new RequestFormatter(fourth);

      expect(firstRequest.matchId).toBe(secondRequest.matchId);
      expect(thirdRequest.matchId).toBe(fourthRequest.matchId);
      expect([firstRequest.matchId,secondRequest.matchId ]).not.toEqual([thirdRequest.matchId,fourthRequest.matchId])
      
      expect(firstRequest.players.length).toBeLessThan(2);
      expect(firstRequest.players).toContain(firstPlayer);

      expect(secondRequest.players.length).toEqual(2);
      expect(secondRequest.players).toEqual([firstPlayer, secondPlayer]);
      expect(secondRequest.players).not.toEqual([thirdPlayer, fourthPlayer]);

      expect(thirdRequest.players.length).toBeLessThan(2);
      expect(thirdRequest.players).toContain(thirdPlayer);

      expect(fourthRequest.players.length).toEqual(2);
      expect(fourthRequest.players).toEqual([thirdPlayer, fourthPlayer]);
      expect(fourthRequest.players).not.toEqual([firstPlayer, secondPlayer]);
    });

    it('Should allow either player to be X or O', async () => {
      const playerIds = [1, 2].map(() => generateId());
      const [firstPlayer, secondPlayer] = playerIds;

      const [first, second] = await multipleRequests(playerIds);

      const firstRequest = new RequestFormatter(first);
      const secondRequest = new RequestFormatter(second);

      expect(firstRequest.playerPiece(firstPlayer)).not.toEqual(secondRequest.playerPiece(secondPlayer));
    });
  });

  describe('POST: /submitMove', () => {
    const playerIds = [generateId(), generateId()];
    let match;
    let playerPiece;
    let move = {}

    it('Should return status code 200', async () => {
      [firstPlayer, secondPlayer] = playerIds;

      const [, request] = await multipleRequests(playerIds);

      match = new RequestFormatter(request);

      playerPiece = match.playerPiece(firstPlayer);

      move = {
        player: playerPiece,
        row: 0,
        column: 0,
        matchId: match.matchId,
      };

      const response = await submitMove(move);

      expect(response.status).toBe(200);
    });

    it('Should return status code 404 when a move is made on a non-existing match', async () => {
      const response = await submitMove({
        player: playerPiece,
        row: 0,
        column: 0,
        matchId: generateId(),
      });

      expect(response.status).toBe(404);
    });

    it('Should return status code 400 when there are missing parameter(s)', async () => {
      const response = await submitMove();

      expect(response.status).toBe(400);

      expect(response.body.message).toContain('required');
    });

    it('Should return status code 400 when a player register another move before opponent makes a move', async () => {
      move.column = 1

      const response = await submitMove(move);

      expect(response.status).toBe(400);
    });

    it('Should return status code 400 when  a move is made in the same position', async () => {
      move.player = playerPiece === 'X' ? 'O' : 'X';
      move.row = 0;
      move.column = 0;

      const response = await submitMove(move);

      expect(response.status).toBe(400);
    });

    it('Should emit submitMove to client', async () => {
      move.player = playerPiece === 'X' ? 'O' : 'X';
      move.row = 0;
      move.column = 1;

      await submitMove(move);

      expect(socketSpy).toHaveBeenCalledWith('submitMove', expect.anything());
    });
  });
});
