import {GameMode, GameModeBoardConfig} from '../../types';

/**
 *
 * @param gameMode
 * @returns
 */
export const getBoardConfig = (gameMode: GameMode): GameModeBoardConfig => {
    switch (gameMode) {
    case GameMode.FOUR_BY_FOUR:
        return {
            numRows: 4,
            numCols: 4,
            tileSize: 60,
            tileSpacing: 10,
            startRow: 1,
            startCol: 1,
            tileWithBorder: 52,
            borderWidth: 4,
            gameMode,
        };
    case GameMode.FIVE_BY_FIVE:
        return {
            numRows: 5,
            numCols: 5,
            tileSize: 50,
            tileSpacing: 5,
            startRow: 2,
            startCol: 2,
            tileWithBorder: 42,
            borderWidth: 4,
            gameMode,
        };
    case GameMode.DAILY_CHALLENGE:
        return {
            numRows: 5,
            numCols: 5,
            tileSize: 50,
            tileSpacing: 5,
            startRow: 2,
            startCol: 2,
            tileWithBorder: 42,
            borderWidth: 4,
            gameMode,
        };
    }
};
