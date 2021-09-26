/* eslint-disable no-undef */
const result = require('../../services/result');

describe('Result', () => {
  it('Should find a win diagonally', () => {
    const board = [['O', 'O', 'X'], ['O', 'X', ''], ['X', '', '']];
    const { winner } = result.compute(board);
    expect(winner).toBe('X');
  });

  it('Should find a win anti-diagonally', () => {
    const board = [['X', '', ''], ['O', 'X', ''], ['O', 'O', 'X']];
    const { winner } = result.compute(board);
    expect(winner).toBe('X');
  });

  it('Should find a win first row, horizontally', () => {
    const board = [['X', 'X', 'X'], ['O', 'O', ''], ['O', 'X', 'O']];
    const { winner } = result.compute(board);
    expect(winner).toBe('X');
  });

  it('Should find a win second row, horizontally', () => {
    const board = [['X', 'O', 'X'], ['O', 'O', 'O'], ['O', 'X', 'X']];
    const { winner } = result.compute(board);
    expect(winner).toBe('O');
  });

  it('Should find a win third row, horizontally', () => {
    const board = [['O', 'O', ''], ['O', 'X', 'O'], ['X', 'X', 'X']];
    const { winner } = result.compute(board);
    expect(winner).toBe('X');
  });

  it('Should find a win first column, vertically', () => {
    const board = [['O', '', 'X'], ['O', 'O', ''], ['O', 'X', 'X']];
    const { winner } = result.compute(board);
    expect(winner).toBe('O');
  });

  it('Should find a win second column, vertically', () => {
    const board = [['O', 'X', ''], ['', 'X', ''], ['O', 'X', 'O']];
    const { winner } = result.compute(board);
    expect(winner).toBe('X');
  });

  it('Should find a win third column, vertically', () => {
    const board = [['O', 'O', 'X'], ['O', 'O', 'X'], ['X', '', 'X']];
    const { winner } = result.compute(board);
    expect(winner).toBe('X');
  });

  it('Should be a tie', () => {
    const board = [['O', 'O', 'X'], ['X', 'O', 'O'], ['O', 'X', 'X']];
    const { winner, gameOver } = result.compute(board);

    expect(winner).toBeNull();

    expect(gameOver).toBeTruthy();
  });
});
