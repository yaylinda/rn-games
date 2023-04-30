import React from 'react';
import {StyleSheet, View} from 'react-native';
import {PanGestureHandler,} from 'react-native-gesture-handler';
import useGameStore from '../stores/gameStore';
import Tile from './Tile';
import GameGrid from './GameGrid';
import Animated, {runOnJS, useAnimatedGestureHandler, useSharedValue, withTiming} from 'react-native-reanimated';
import useGameModeStore from '../stores/gameModeStore';
import {MoveDirection} from '../../types';
// import {translationMultiplier} from '../utils/mover';

export default function GameBoard() {
    const {initTileLocations, tileLocations, prevTileLocations, move} = useGameStore();
    const {gameModeBoardConfig: {numRows, numCols, tileSize, tileSpacing}} = useGameModeStore();

    const gridSize = tileSize + tileSpacing;
    const threshold = gridSize / 2;
    const dragX = useSharedValue(0);
    const dragY = useSharedValue(0);

    const gestureHander = useAnimatedGestureHandler({
        onActive: (e) => {
            if (Math.abs(e.translationX) > Math.abs(e.translationY)) {
                // Move horizontal
                if (Math.abs(e.translationX) > threshold) {
                    dragX.value = gridSize * (e.translationX < 0 ? -1 : 1);
                    dragY.value = 0;
                } else {
                    dragX.value = 0;
                    dragY.value = 0;
                }
            } else {
                // Move vertical
                if (Math.abs(e.translationY) > threshold) {
                    dragX.value = 0;
                    dragY.value = gridSize * (e.translationY < 0 ? -1 : 1);
                } else {
                    dragX.value = 0;
                    dragY.value = 0;
                }
            }
            console.log(`[DRAG] x=${e.translationX}, y=${e.translationY}`);
        },
        onEnd: (e) => {
            console.log(`[END] x=${e.translationX}, y=${e.translationY}`);
            // const doMove = (dir: MoveDirection) => {
            //     move(dir);
            // };

            if (Math.abs(e.translationX) > Math.abs(e.translationY)) {
                // Move horizontal
                if (Math.abs(e.translationX) > threshold) {
                    runOnJS(move)(e.translationX < 0 ? MoveDirection.LEFT : MoveDirection.RIGHT);
                    dragX.value = withTiming(gridSize * (e.translationX < 0 ? -1 : 1));
                    dragY.value = 0;
                    console.log('*************************** MOVE HORIZONTAL');
                } else {
                    dragX.value = withTiming(0);
                    dragY.value = withTiming(0);
                }
            } else {
                // Move vertical
                if (Math.abs(e.translationY) > threshold) {
                    runOnJS(move)(e.translationY < 0 ? MoveDirection.UP : MoveDirection.DOWN );
                    dragX.value = 0;
                    dragY.value = withTiming(gridSize * (e.translationY < 0 ? -1 : 1));
                    console.log('*************************** MOVE VERTICAL');
                } else {
                    dragX.value = withTiming(0);
                    dragY.value = withTiming(0);
                }
            }
        },
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
                            <Tile
                                key={tile.tile.id}
                                tile={tile.tile}
                                // initCoordinates={prevTileLocations[tile.tile.id]?.coordinates}
                                currentCoordinates={tile.coordinates}
                                previousCoordinates={prevTileLocations[tile.tile.id]?.coordinates}
                                dragX={dragX}
                                dragY={dragY}
                            />
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
