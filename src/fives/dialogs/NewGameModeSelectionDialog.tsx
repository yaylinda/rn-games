import {FontAwesome5} from '@expo/vector-icons';
import React, {useEffect, useState} from 'react';
import {Modal, Pressable, Text, View} from 'react-native';
import {colors} from '../../theme';
import {GameMode} from '../../types';
import useGameModeStore from '../stores/gameModeStore';
import useGameStore from '../stores/gameStore';
import useHighScoresStore from '../stores/highScoresStore';

const NewGameModeSelectionDialog = () => {
    const {
        gameModeBoardConfig,
        showNewGameModeSelectionDialog,
        closeNewGameModeSelectionDialog,
        updateMode,
    } = useGameModeStore();
    const {newGame} = useGameStore();
    const {resetPosting} = useHighScoresStore();
    const [selectedMode, setSelectedMode] = useState<GameMode>(gameModeBoardConfig);

    useEffect(() => {
        setSelectedMode(gameModeBoardConfig);
    }, [gameModeBoardConfig]);

    const startNewGame = () => {
        updateMode(selectedMode);
        newGame();
        resetPosting();
        closeNewGameModeSelectionDialog();
    };

    return (
        <Modal
            visible={showNewGameModeSelectionDialog}
            onDismiss={closeNewGameModeSelectionDialog}
        >
            <Text style={{color: colors.ACCENT}}>New Game?</Text>
            <View>
                <Pressable onPress={() => setSelectedMode(GameMode.DAILY_CHALLENGE)}>
                    <FontAwesome5 name='calendar-day'/>
                    <Text>{GameMode.DAILY_CHALLENGE}</Text>
                </Pressable>
                <Pressable onPress={() => setSelectedMode(GameMode.FOUR_BY_FOUR)}>
                    <FontAwesome5 name='dice-four'/>
                    <Text>{GameMode.FOUR_BY_FOUR}</Text>
                </Pressable>
                <Pressable onPress={() => setSelectedMode(GameMode.FIVE_BY_FIVE)}>
                    <FontAwesome5 name='dice-five'/>
                    <Text>{GameMode.FIVE_BY_FIVE}</Text>
                </Pressable>
            </View>
            <View style={{justifyContent: 'space-between'}}>
                <Pressable onPress={closeNewGameModeSelectionDialog}>
                    <FontAwesome5 name='times' color='red'/>
                </Pressable>
                <Pressable onPress={startNewGame}>
                    <FontAwesome5 name='check' color='green'/>
                </Pressable>
            </View>
        </Modal>
    );
};

export default NewGameModeSelectionDialog;
