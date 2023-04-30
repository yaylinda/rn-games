import {StyleSheet, View} from 'react-native';
import React from 'react';
import {colors} from '../../theme';
import useGameModeStore from '../stores/gameModeStore';

const GameGrid = () => {
    const { gameModeBoardConfig: {numRows, numCols, tileSize, tileSpacing} } = useGameModeStore();

    return (
        <View style={styles.grid}>
            {Array.from(Array(numRows)).map((_, r) => (
                <View key={`row_${r}`} style={styles.row}>
                    {Array.from(Array(numCols)).map((_, c) => {
                        const isLastRow = r === numRows - 1;
                        const isLastCol = c === numCols - 1;
                        return (
                            <View
                                key={`row_${r}_col_${c}`}
                                style={[
                                    styles.cell,
                                    {
                                        height: tileSize,
                                        width: tileSize,
                                        marginRight: isLastCol ? 0 : tileSpacing,
                                        marginBottom: isLastRow ? 0 : tileSpacing,
                                    },
                                ]}
                            />
                        );
                    })}
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    grid: {
        display: 'flex',
        flexDirection: 'column',
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
    },
    cell: {
        backgroundColor: colors.DARK,
        borderRadius: 50,
    },
});

export default GameGrid;