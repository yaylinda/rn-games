import {GameModeBoardConfig, IntermediateTileData, TileData} from '../../types';

/**
 *
 * @returns
 */
export const initBoard = (config: GameModeBoardConfig): TileData[][] => {
    return Array.from(Array(config.numRows)).map(() =>
        Array.from(Array(config.numCols)).map(() => ({
            id: '',
            value: 0,
            isNew: false,
            isMerge: false,
        }))
    );
};

/**
 *
 * @returns
 */
export const initIntermediateBoard = (config: GameModeBoardConfig): IntermediateTileData[][] => {
    return Array.from(Array(config.numRows)).map(() =>
        Array.from(Array(config.numCols)).map(() => ({ tiles: [] }))
    );
};
