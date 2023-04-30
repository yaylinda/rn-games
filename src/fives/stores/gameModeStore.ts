import AsyncStorage from '@react-native-async-storage/async-storage';
import {create} from 'zustand';
import {GameMode, GameModeBoardConfig} from '../../types';
import {GAME_MODE} from '../utils/constants';
import {getBoardConfig} from '../utils/config';

export const DEFAULT_GAME_MODE = GameMode.FIVE_BY_FIVE;

interface GameModeState {
    gameModeBoardConfig: GameModeBoardConfig;
    showNewGameModeSelectionDialog: boolean;
    init: () => void;
    updateMode: (mode: GameMode) => void;
    openNewGameModeSelectionDialog: () => void;
    closeNewGameModeSelectionDialog: () => void;
}

const useGameModeStore = create<GameModeState>()((set) => ({
    gameModeBoardConfig: getBoardConfig(DEFAULT_GAME_MODE),
    showNewGameModeSelectionDialog: false,

    /**
     *
     * @returns
     */
    init: async () => {
        const gameModeStr = await AsyncStorage.getItem(GAME_MODE);

        set((state) => {
            if (gameModeStr) {
                const gameMode: GameMode = GameMode[gameModeStr as keyof typeof GameMode];
                return {
                    ...state,
                    gameModeBoardConfig: getBoardConfig(gameMode),
                };
            }

            AsyncStorage.setItem(GAME_MODE, DEFAULT_GAME_MODE);

            return {
                ...state,
                gameModeBoardConfig: getBoardConfig(DEFAULT_GAME_MODE),
            };
        });
    },

    /**
     *
     * @param gameMode
     * @returns
     */
    updateMode: (gameMode: GameMode) =>
        set((state) => {
            AsyncStorage.setItem(GAME_MODE, gameMode);
            return {...state, gameModeBoardConfig: getBoardConfig(gameMode)};
        }),

    /**
     *
     * @returns
     */
    openNewGameModeSelectionDialog: () =>
        set((state) => ({...state, showNewGameModeSelectionDialog: true})),

    /**
     *
     * @returns
     */
    closeNewGameModeSelectionDialog: () =>
        set((state) => ({...state, showNewGameModeSelectionDialog: false})),
}));

export default useGameModeStore;
