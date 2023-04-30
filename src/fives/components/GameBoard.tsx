import React from 'react';
import {StyleSheet, View} from 'react-native';
import {PanGestureHandler,} from 'react-native-gesture-handler';
import useGameStore from '../stores/gameStore';
import Tile from './Tile';
import GameGrid from './GameGrid';
import Animated, {
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';
import useGameModeStore from '../stores/gameModeStore';

export default function GameBoard() {
    const {initTileLocations, prevTileLocations, move} = useGameStore();
    const {gameModeBoardConfig: {numRows, numCols, tileSize, tileSpacing}} = useGameModeStore();

    const dragX = useSharedValue(0);
    const dragY = useSharedValue(0);

    const gestureHander = useAnimatedGestureHandler({
        onActive: (e) => {
            if (Math.abs(e.translationX) > Math.abs(e.translationY)) {
                dragX.value = e.translationX;
                dragY.value = 0;
            } else {
                dragX.value = 0;
                dragY.value = e.translationY;
            }
            console.log(`[DRAG] x=${e.translationX}, y=${e.translationY}`);
        },
        onEnd: (e) => {
            console.log('END!');
            // if (e.translationX > threshold) {
            //     dragX.value = withTiming(0);
            // }
            dragX.value = withTiming(0);
            dragY.value = withTiming(0);
        },
    });

    const animatedTilesContainerStyles = useAnimatedStyle(() => ({
        transform: [
            {
                translateX: dragX.value,
            },
            {
                translateY: dragY.value,
            }
        ],
    }));

    return (
        <View style={styles.container}>
            <GameGrid/>
            <PanGestureHandler onGestureEvent={gestureHander}>
                <Animated.View style={[styles.tilesContainer]}>
                    {Object.values(initTileLocations)
                        .reverse()
                        .map((tile) => (
                            <Tile
                                key={tile.tile.id}
                                tile={tile.tile}
                                initialCoordinates={tile.coordinates}
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
