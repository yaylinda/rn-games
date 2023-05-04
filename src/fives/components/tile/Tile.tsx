import React from 'react';
import {Text, View} from 'react-native';
import {colors} from '../../../theme';
import useGameModeStore from '../../stores/gameModeStore';
import {MERGABLES, START_NUM_2, START_NUM_3, STARTING_NUMS,} from '../../utils/constants';
import type {Coordinates, GameModeBoardConfig, TileData} from '../../../types';
import Animated, {
    SharedValue,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';
import {convertCoordinateToPixel, DEFAULT, getTileSize, STYLES} from './common';

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
        dragX=${dragX.value}
        dragY=${dragY.value}
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

    const derivedDragX = useSharedValue(isNew ? 0 : dragX.value);
    const derivedDragY = useSharedValue(isNew ? 0 : dragY.value);
    // const xPos = useDerivedValue(() => {
    //     const pos = prevLeft === null ? currLeft : prevLeft;
    //     return pos + dragX.value;
    // });
    // const yPos = useDerivedValue(() => {
    //     const pos = prevTop === null ? currTop : prevTop;
    //     return pos + dragY.value;
    // });
    // const xPos = useSharedValue(currLeft);
    // const yPos = useSharedValue(currTop);

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
            // top: yPos.value,
            // left: xPos.value,
            transform: [
                {
                    scale: withTiming(scale.value, {duration: 100}),
                },
                {
                    translateX: withTiming(derivedDragX.value, {},() => {
                        console.log(`${tile.id} after translateX - derivedDragX=${derivedDragX.value}`);
                        // if (prevLeft) {
                        //     xPos.value = xPos.value + dragX.value;
                        // }
                        derivedDragX.value = 0;
                    }),
                },
                {
                    translateY: withTiming(derivedDragY.value, {}, () => {
                        console.log(`${tile.id} after translateY - derivedDragY=${derivedDragY.value}`);
                        // if (prevTop) {
                        //     yPos.value = yPos.value + dragY.value;
                        // }
                        derivedDragY.value = 0;
                    }),
                },
            ],
        };
    }, [derivedDragX, derivedDragY]);

    const getTileZIndex = () => {
        if (isNew) {
            return 0;
        }
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
                    zIndex: getTileZIndex(),
                    top: currTop,
                    left: currLeft,
                },
            ]}
        >
            <Text>{value}</Text>
        </Animated.View>
    );
};

export default Tile;
