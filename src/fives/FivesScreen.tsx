import React from 'react';
import {Button, StyleSheet, View} from 'react-native';
import {colors} from '../theme';
import Game from './components/Game';
import NewGameModeSelectionDialog from './dialogs/NewGameModeSelectionDialog';
import useGameModeStore from './stores/gameModeStore';
import useGameStore from './stores/gameStore';
import useHighScoresStore from './stores/highScoresStore';
import useUserStore from './stores/userStore';

const FivesScreen = () => {
    const {restoreState} = useGameStore();
    const {init: initUserStore} = useUserStore();
    const {
        init: initHighScoresStore,
        openHighScoresDialog
    } = useHighScoresStore();
    const {
        init: initModeStore,
        openNewGameModeSelectionDialog,
    } = useGameModeStore();

    React.useEffect(() => {
        initModeStore();
        restoreState();
        initUserStore();
        initHighScoresStore();
    }, [initModeStore, restoreState, initUserStore, initHighScoresStore]);

    return (
        <View style={styles.container}>
            <Game/>
            <View style={styles.buttonBar}>
                <Button title="New Game" onPress={openNewGameModeSelectionDialog}/>
                <Button title="See High Scores" onPress={openHighScoresDialog}/>
            </View>
            {/*<GameOverDialog />*/}
            {/*<PostHighScoreDialog />*/}
            <NewGameModeSelectionDialog/>
            {/*<HighScoresDialog />*/}
            {/*<Snackbar*/}
            {/*    visible={successfullyPosted}*/}
            {/*    onDismiss={resetPosting}*/}
            {/*    action={{*/}
            {/*        label: "Scores",*/}
            {/*        onPress: openHighScoresDialog,*/}
            {/*    }}*/}
            {/*>*/}
            {/*    Successfully posted high score!*/}
            {/*</Snackbar>*/}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.BACKGROUND,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonBar: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
    },
});

export default FivesScreen;