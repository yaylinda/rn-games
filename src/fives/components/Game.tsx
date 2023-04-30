import React from 'react';
import { StyleSheet, View } from 'react-native';
import {colors, UNIT_PX} from '../../theme';
import GameBoard from './GameBoard';
import GameStatsBar from './GameStatsBar';

/**
 *
 * @returns
 */
export default function Game() {
    return (
        <View style={styles.container}>
            <GameStatsBar />
            <GameBoard />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        color: colors.LIGHT,
        width: 270,
        marginRight: 'auto',
        marginLeft: 'auto',
        marginTop: 3 * UNIT_PX,
    },
});
