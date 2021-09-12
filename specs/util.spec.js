/* eslint-disable no-undef */
const { matchStatus } = require('../scripts/utils');

describe('Match', () => {
  it('Should find a win diagonally', () => {
    const board = [['O', 'O', 'X'], ['O', 'X', ''], ['X', '', '']];
    const { winner } = matchStatus({ board });
    expect(winner).toBe('X');
  });

  it('Should find a win anti-diagonally', () => {
    const board = [['X', '', ''], ['O', 'X', ''], ['O', 'O', 'X']];
    const { winner } = matchStatus({ board });
    expect(winner).toBe('X');
  });

  it('Should find a win first row, horizontally', () => {
    const board = [['X', 'X', 'X'], ['O', 'O', ''], ['O', 'X', 'O']];
    const { winner } = matchStatus({ board });
    expect(winner).toBe('X');
  });

  it('Should find a win second row, horizontally', () => {
    const board = [['X', 'O', 'X'], ['O', 'O', 'O'], ['O', 'X', 'X']];
    const { winner } = matchStatus({ board });
    expect(winner).toBe('O');
  });

  it('Should find a win third row, horizontally', () => {
    const board = [['O', 'O', ''], ['O', 'X', 'O'], ['X', 'X', 'X']];
    const { winner } = matchStatus({ board });
    expect(winner).toBe('X');
  });

  it('Should find a win first column, vertically', () => {
    const board = [['O', '', 'X'], ['O', 'O', ''], ['O', 'X', 'X']];
    const { winner } = matchStatus({ board });
    expect(winner).toBe('O');
  });

  it('Should find a win second column, vertically', () => {
    const board = [['O', 'X', ''], ['', 'X', ''], ['O', 'X', 'O']];
    const { winner } = matchStatus({ board });
    expect(winner).toBe('X');
  });

  it('Should find a win third column, vertically', () => {
    const board = [['O', 'O', 'X'], ['O', 'O', 'X'], ['X', '', 'X']];
    const { winner } = matchStatus({ board });
    expect(winner).toBe('X');
  });

  it('Should be a tie', () => {
    const board = [['O', 'O', 'X'], ['X', 'O', 'O'], ['O', 'X', 'X']];
    const { winner, gameOver } = matchStatus({ board });

    expect(winner).toBe(null);

    expect(gameOver).toBeTruthy();
  });
});
