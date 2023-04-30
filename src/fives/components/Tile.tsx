import React from 'react';
import {Text, View} from 'react-native';
import {colors} from '../../theme';
import useGameModeStore from '../stores/gameModeStore';
import {MERGABLES, START_NUM_2, START_NUM_3, STARTING_NUMS,} from '../utils/constants';
import type {Coordinates, GameModeBoardConfig, TileData} from '../../types';
import Animated, {
    SharedValue,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';

/**
 * Font sizes
 */
const DEFAULT_FONT_SIZE = 24;
const THREE_DIGIT_FONT_SIZE = 20;
const FOUR_DIGIT_FONT_SIZE = 14;
const FIVE_DIGIT_FONT_SIZE = 10;

/**
 *
 * @param isStartingNum
 * @param config
 * @returns
 */
const getTileSize = (isStartingNum: boolean, config: GameModeBoardConfig) => ({
    height: config.tileSize,
    width: config.tileSize,
    borderStyle: isStartingNum ? 'none' : 'solid',
    borderWidth: isStartingNum ? 0 : config.borderWidth,
});

/**
 * Default tile styles
 */
const DEFAULT = {
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
const STYLES: { [key in string]: any } = {
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

const convertCoordinateToPixel = (
    coord: number,
    config: GameModeBoardConfig
): number => {
    return coord * config.tileSize + coord * config.tileSpacing;
};

interface TileProps {
    tile: TileData;
    // initCoordinates: Coordinates;
    currentCoordinates: Coordinates;
    previousCoordinates?: Coordinates;
    dragX: SharedValue<number>;
    dragY: SharedValue<number>;
}

/**
 * Tile
 *
 * @param param0
 * @returns
 */
const Tile = ({tile, currentCoordinates, previousCoordinates, dragX, dragY}: TileProps) => {
    const {id, value, isNew, isMerge} = tile;

    console.log(`[TILE RENDER] ${id}
        isNew=${isNew}
        currentCoordinates=${JSON.stringify(currentCoordinates)}
        previousCoordinates=${JSON.stringify(previousCoordinates)}
        value=${value}
    `);

    const {gameModeBoardConfig} = useGameModeStore();

    const isStartingNum = STARTING_NUMS.includes(value);

    // const initTop = convertCoordinateToPixel(initCoordinates.row, gameModeBoardConfig);
    // const initLeft = convertCoordinateToPixel(initCoordinates.col, gameModeBoardConfig);
    const currTop = convertCoordinateToPixel(currentCoordinates.row, gameModeBoardConfig);
    const currLeft = convertCoordinateToPixel(currentCoordinates.col, gameModeBoardConfig);
    const prevTop = previousCoordinates
        ? convertCoordinateToPixel(previousCoordinates.row, gameModeBoardConfig)
        : null;
    const prevLeft = previousCoordinates
        ? convertCoordinateToPixel(previousCoordinates.col, gameModeBoardConfig)
        : null;

    const derivedDragX = useDerivedValue(() => isNew ? 0 : dragX.value);
    const derivedDragY = useDerivedValue(() => isNew ? 0 : dragY.value);
    // const xPos = useDerivedValue(() => {
    //     const pos = prevLeft === null ? currLeft : prevLeft;
    //     return pos + dragX.value;
    // });
    // const yPos = useDerivedValue(() => {
    //     const pos = prevTop === null ? currTop : prevTop;
    //     return pos + dragY.value;
    // });
    const xPos = useSharedValue(prevLeft === null ? currLeft : prevLeft);
    const yPos = useSharedValue(prevTop === null ? currTop : prevTop);
    const scale = useSharedValue(isNew ? 0 : 1);

    React.useEffect(() => {
        if (isMerge) {
            scale.value = 1.1;
            setTimeout(() => (scale.value = 1), 100);
        }
    }, [isMerge, scale]);

    React.useEffect(() => {
        if (isNew) {
            setTimeout(() => {
                scale.value = 1.1;
                setTimeout(() => (scale.value = 1), 100);
            }, 100);
        }
    }, [isNew, scale]);

    const animatedStyles = useAnimatedStyle(() => {
        return {
            top: yPos.value,
            left: xPos.value,
            transform: [
                {
                    scale: withTiming(scale.value, {duration: 100}),
                },
                {
                    translateX: withTiming(derivedDragX.value, {},() => {
                        // xPos.value = xPos.value + dragX.value;
                        console.log('after translateX');
                    }),
                },
                {
                    translateY: withTiming(derivedDragY.value, {}, () => {
                        // yPos.value = yPos.value + dragY.value;
                        console.log('after translateY');
                    }),
                },
            ],
        };
    });

    const getTileZIndex = () => {
        if (STARTING_NUMS.includes(value)) {
            return 1;
        }
        return MERGABLES.indexOf(value) + 2;
    };

    return (
        <Animated.View
            style={[
                DEFAULT,
                STYLES[`tile_${value}`],
                getTileSize(isStartingNum, gameModeBoardConfig),
                animatedStyles,
                {
                    zIndex: isNew ? 0 : getTileZIndex(),
                    // top: prevTop === null ? currTop : prevTop,
                    // left: prevLeft === null ? currLeft : prevLeft,
                },
            ]}
        >
            <Text>{value}</Text>
        </Animated.View>
    );
};

const SMALL_TILE_WITHOUT_BORDER = {
    height: 20,
    width: 20,
    borderStyle: 'none',
};

const SMALL_TILE_WITH_BORDER = {
    height: 12,
    width: 12,
    borderStyle: 'solid',
    borderWidth: 4,
};

/**
 *
 * @param param0
 * @returns
 */
export const PreviewTile = ({value}: { value: number }) => {
    const isStartNum = value === START_NUM_2 || value === START_NUM_3;

    return (
        <View
            style={[
                DEFAULT,
                STYLES[`tile_${value}`],
                isStartNum ? SMALL_TILE_WITHOUT_BORDER : SMALL_TILE_WITH_BORDER,
            ]}
        />
    );
};

export default Tile;
