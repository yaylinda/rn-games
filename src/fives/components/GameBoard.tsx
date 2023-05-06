import React from 'react';
import {StyleSheet, View} from 'react-native';
import {PanGestureHandler, PanGestureHandlerGestureEvent,} from 'react-native-gesture-handler';
import useGameStore from '../stores/gameStore';
import Tile from './tile/Tile';
import GameGrid from './GameGrid';
import Animated, {
    runOnJS,
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';
import useGameModeStore from '../stores/gameModeStore';
import {MoveDirection} from '../../types';
// import {translationMultiplier} from '../utils/mover';

type DragContext = {
    translateX: number;
    translateY: number;
};

export default function GameBoard() {
    const {tileLocations, move} = useGameStore();
    // const {gameModeBoardConfig: {numRows, numCols, tileSize, tileSpacing}} = useGameModeStore();

    // const gridSize = tileSize + tileSpacing;
    // const threshold = gridSize / 2;
    const dragX = useSharedValue(0);
    const dragY = useSharedValue(0);

    const gestureHander = useAnimatedGestureHandler<PanGestureHandlerGestureEvent, DragContext>({
        onStart: (event, context) => {
            context.translateX = dragX.value;
            context.translateY = dragY.value;
        },
        onActive: (e, context) => {
            const gridSize = 70;
            const threshold = 35;
            dragX.value = e.translationX + context.translateX;
            dragY.value = e.translationY + context.translateY;

            if (Math.abs(e.translationX) > Math.abs(e.translationY)) {
                // Move horizontal
                if (Math.abs(e.translationX) > threshold && Math.abs(e.translationX) <= gridSize) {
                    dragX.value = e.translationX + context.translateX;
                    dragY.value = context.translateY;
                } else if (Math.abs(e.translationX) > gridSize) {
                    dragX.value = gridSize + context.translateX;
                    dragY.value = context.translateY;
                } else {
                    dragX.value = context.translateX;
                    dragY.value = context.translateY;
                }
            } else {
                // Move vertical
                if (Math.abs(e.translationY) > threshold && Math.abs(e.translationY) <= gridSize) {
                    dragX.value = context.translateX;
                    dragY.value = e.translationY + context.translateY;
                } else if (Math.abs(e.translationY) > gridSize) {
                    dragX.value = context.translateX;
                    dragY.value = gridSize + context.translateY;
                } else {
                    dragX.value = context.translateX;
                    dragY.value = context.translateY;
                }
            }
            console.log(`[DRAG] x=${e.translationX}, y=${e.translationY}`);
        },
        onEnd: (e, context) => {
            const threshold = 35;
            const gridSize = 70;
            console.log(`[END] x=${e.translationX}, y=${e.translationY}`);

            if (Math.abs(e.translationX) > Math.abs(e.translationY)) {
                // Move horizontal
                if (Math.abs(e.translationX) > threshold) {
                    console.log('*************************** MOVE HORIZONTAL');
                    // runOnJS(move)(e.translationX < 0 ? MoveDirection.LEFT : MoveDirection.RIGHT, () => {});
                    dragX.value = withTiming((e.translationX < 0 ? -gridSize : gridSize) + context.translateX);
                    dragY.value = context.translateY;
                } else {
                    dragX.value = withTiming(context.translateX);
                    dragY.value = withTiming(context.translateY);
                }
            } else {
                // Move vertical
                if (Math.abs(e.translationY) > threshold) {
                    console.log('*************************** MOVE VERTICAL');
                    // runOnJS(move)(e.translationY < 0 ? MoveDirection.UP : MoveDirection.DOWN, () => {});
                    dragX.value = context.translateX;
                    dragY.value = withTiming(e.translationY + context.translateY);
                } else {
                    dragX.value = withTiming(context.translateX);
                    dragY.value = withTiming(context.translateY);
                }
            }

            // if (Math.abs(e.translationX) > threshold || Math.abs(e.translationY) > threshold) {
            //     console.log('[END] resetting drag');
            //     dragX.value = 0;
            //     dragY.value = 0;
            // }
        },
    });

    const animatedStyles = useAnimatedStyle(() => {
        return {
            // top: yPos.value,
            // left: xPos.value,
            transform: [
                {
                    translateX: withTiming(dragX.value, {},() => {
                        // console.log(`${tile.id} after translateX - derivedDragX=${derivedDragX.value}`);
                        // if (prevLeft) {
                        //     xPos.value = xPos.value + dragX.value;
                        // }
                        // derivedDragX.value = 0;
                    }),
                },
                {
                    translateY: withTiming(dragY.value, {}, () => {
                        // console.log(`${tile.id} after translateY - derivedDragY=${derivedDragY.value}`);
                        // if (prevTop) {
                        //     yPos.value = yPos.value + dragY.value;
                        // }
                        // derivedDragY.value = 0;
                    }),
                },
            ],
        };
    });

    console.log('********** [GAMEBOARD RENDER]');

    return (
        <View style={styles.container}>
            <GameGrid/>
            <PanGestureHandler onGestureEvent={gestureHander}>
                <Animated.View style={[styles.tilesContainer]}>
                    {Object.values(tileLocations)
                        .reverse()
                        .map((tile) => (
                            <Animated.View key={tile.tile.id} style={animatedStyles}>
                            <Tile
                                tile={tile.tile}
                                // initCoordinates={prevTileLocations[tile.tile.id]?.coordinates}
                                currentCoordinates={tile.coordinates}
                                // previousCoordinates={prevTileLocations[tile.tile.id]?.coordinates}
                                dragX={dragX}
                                dragY={dragY}
                            />
                            </Animated.View>
                        ))}
                </Animated.View>
            </PanGestureHandler>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },
    tilesContainer: {
        position: 'absolute',
    }
});
