import type {GameModeBoardConfig, TileData} from '../../types';
import {MoveDirection} from '../../types';
import {mergeTiles} from './merger';
import {moveTiles} from './mover';

/**
 *
 * @param board
 * @param config
 * @returns
 */
export const isGameOver = (board: TileData[][], config: GameModeBoardConfig): boolean => {
    const boardFull = isBoardFull(board, config);

    if (!boardFull) {
        return false;
    }

    const left = moveAndMerge(board, MoveDirection.LEFT, config);
    const right = moveAndMerge(board, MoveDirection.RIGHT, config);
    const up = moveAndMerge(board, MoveDirection.UP, config);
    const down = moveAndMerge(board, MoveDirection.DOWN, config);

    return [
        isSame(board, left, config),
        isSame(board, right, config),
        isSame(board, up, config),
        isSame(board, down, config),
    ].every((v) => v);
};

const moveAndMerge = (
    board: TileData[][],
    dir: MoveDirection,
    config: GameModeBoardConfig,
): TileData[][] => {
    const {intermediateBoard} = moveTiles(board, dir, config);
    return mergeTiles(intermediateBoard, config).board;
};

/**
 *
 * @param board
 * @param config
 * @returns
 */
const isBoardFull = (board: TileData[][], config: GameModeBoardConfig): boolean => {
    for (let row = 0; row < config.numRows; row++) {
        for (let col = 0; col < config.numCols; col++) {
            if (board[row][col].value === 0) {
                return false;
            }
        }
    }
    return true;
};

/**
 *
 * @param board1
 * @param board2
 * @param config
 * @returns
 */
const isSame = (board1: TileData[][], board2: TileData[][], config: GameModeBoardConfig): boolean => {
    for (let row = 0; row < config.numRows; row++) {
        for (let col = 0; col < config.numCols; col++) {
            if (board1[row][col].value !== board2[row][col].value) {
                return false;
            }
        }
    }
    return true;
};
