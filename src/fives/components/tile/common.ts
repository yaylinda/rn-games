import {GameModeBoardConfig} from '../../../types';
import {colors} from '../../../theme';

/**
 * Font sizes
 */
export const DEFAULT_FONT_SIZE = 24;
export const THREE_DIGIT_FONT_SIZE = 20;
export const FOUR_DIGIT_FONT_SIZE = 14;
export const FIVE_DIGIT_FONT_SIZE = 10;

/**
 *
 * @param isStartingNum
 * @param config
 * @returns
 */
export const getTileSize = (isStartingNum: boolean, config: GameModeBoardConfig) => ({
    height: config.tileSize,
    width: config.tileSize,
    borderStyle: isStartingNum ? 'none' : 'solid',
    borderWidth: isStartingNum ? 0 : config.borderWidth,
});

/**
 * Default tile styles
 */
export const DEFAULT = {
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    fontSize: DEFAULT_FONT_SIZE,
    backgroundColor: colors.LIGHT,
    color: colors.DARK,
};

/**
 * Tile styles for different values
 */
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export const STYLES: { [key in string]: any } = {
    tile_2: {
        backgroundColor: colors.BRAND,
        color: colors.LIGHT,
    },
    tile_3: {
        backgroundColor: colors.ACCENT,
        color: colors.DARK,
    },
    tile_5: {
        borderColor: '#66c2a5',
    },
    tile_10: {
        borderColor: '#3288bd',
    },
    tile_20: {
        borderColor: '#5e4fa2',
    },
    tile_40: {
        borderColor: '#9e0142',
    },
    tile_80: {
        borderColor: '#d53e4f',
    },
    tile_160: {
        borderColor: '#f46d43',
        fontSize: THREE_DIGIT_FONT_SIZE,
    },
    tile_320: {
        borderColor: '#fdae61',
        fontSize: THREE_DIGIT_FONT_SIZE,
    },
    tile_640: {
        borderColor: '#fee08b',
        fontSize: THREE_DIGIT_FONT_SIZE,
    },
    tile_1280: {
        borderColor: '#e6f598',
        fontSize: FOUR_DIGIT_FONT_SIZE,
    },
    tile_2560: {
        borderColor: '#abdda4',
        fontSize: FOUR_DIGIT_FONT_SIZE,
    },
    tile_5120: {
        borderColor: '#66c2a5',
        fontSize: FOUR_DIGIT_FONT_SIZE,
    },
    tile_10240: {
        borderColor: '#3288bd',
        fontSize: FIVE_DIGIT_FONT_SIZE,
    },
    tile_20480: {
        borderColor: '#5e4fa2',
        fontSize: FIVE_DIGIT_FONT_SIZE,
    },
    tile_40960: {
        borderColor: '#9e0142',
        fontSize: FIVE_DIGIT_FONT_SIZE,
    },
};

export const convertCoordinateToPixel = (
    coord: number,
    config: GameModeBoardConfig
): number => {
    return coord * config.tileSize + coord * config.tileSpacing;
};

export const SMALL_TILE_WITHOUT_BORDER = {
    height: 20,
    width: 20,
    borderStyle: 'none',
};

export const SMALL_TILE_WITH_BORDER = {
    height: 12,
    width: 12,
    borderStyle: 'solid',
    borderWidth: 4,
};
