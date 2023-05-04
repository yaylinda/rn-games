import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import {create} from 'zustand';
import {LOCAL_STORAGE_GAME_STATE} from '../utils/constants';
import {getCoordinatesForNewTile} from '../utils/coordinates';
import {generateTileValue} from '../utils/generator';
import {convertBoardToLocations} from '../utils/locations';
import {mergeTiles} from '../utils/merger';
import {moveTiles} from '../utils/mover';
import {isGameOver,} from '../utils/utils';
import useGameModeStore from './gameModeStore';
import type {MoveDirection, TileData, TileLocations} from '../../types';
import {initBoard, initIntermediateBoard} from '../utils/init';

export interface GameState {
    hasStarted: boolean;
    board: TileData[][];
    initTileLocations: TileLocations;
    tileLocations: TileLocations;
    prevTileLocations: TileLocations;
    isGameOver: boolean;
    showGameOverDialog: boolean;
    score: number;
    moves: number;
    merged: { [key in number]: number };
    generated: { [key in number]: number };
    nextValue: number;
    lastMoveDirection: MoveDirection | null;
    currentGameId: string;
    move: (dir: MoveDirection, callback: () => void) => void;
    newGame: () => void;
    restoreState: () => void;
    openGameOverDialog: () => void;
    closeGameOverDialog: () => void;
}

const useGameStore = create<GameState>()((set) => ({
    hasStarted: false,
    board: initBoard(useGameModeStore.getState().gameModeBoardConfig),
    initTileLocations: {},
    tileLocations: {},
    prevTileLocations: {},
    isGameOver: false,
    showGameOverDialog: false,
    score: 0,
    moves: 0,
    merged: {},
    generated: {},
    nextValue: 0,
    lastMoveDirection: null,
    currentGameId: uuid.v4() as string,

    /**
     *
     * @param dir
     * @returns
     */
    move: (dir: MoveDirection, callback: () => void) =>
        set((state) => {
            console.log('[gameStore] doing move logic!');

            if (!state.hasStarted || state.isGameOver) {
                return state;
            }

            const config = useGameModeStore.getState().gameModeBoardConfig;

            // Move and merge the tiles.
            const {intermediateBoard, moved} = moveTiles(state.board, dir, config);
            const {board, merged, score} = mergeTiles(intermediateBoard, config);

            // Update the count of the tiles that got merged.
            for (const key in merged) {
                if (!state.merged[key]) {
                    state.merged[key] = 0;
                }
                state.merged[key] = state.merged[key] + merged[key];
            }

            // Put a new tile on the board (if applicable).
            let usedNextValue = false;
            let moves = state.moves;
            const coords = getCoordinatesForNewTile(board, dir, moved, config);
            if (coords != null) {
                moves = moves + 1;
                usedNextValue = true;
                const newValue = state.nextValue;
                board[coords.row][coords.col] = {
                    id: `tile_${moves}`,
                    value: newValue,
                    isNew: true,
                    isMerge: false,
                };

                if (!state.generated[newValue]) {
                    state.generated[newValue] = 0;
                }
                state.generated[newValue] = state.generated[newValue] + 1;
            }

            // Check if game is over.
            const gameOver = isGameOver(JSON.parse(JSON.stringify(board)), config);

            // Persist the updated state in localStorage.
            const updatedState = {
                ...state,
                board: [...board],
                tileLocations: convertBoardToLocations(
                    board,
                    intermediateBoard,
                    config
                ),
                prevTileLocations: state.tileLocations,
                isGameOver: gameOver,
                showGameOverDialog: gameOver,
                moves: moves,
                score: state.score + score,
                merged: {...state.merged},
                generated: {...state.generated},
                nextValue: usedNextValue
                    ? generateTileValue(state.merged, state.generated, moves)
                    : state.nextValue,
                lastMoveDirection: dir,
            };
            AsyncStorage.setItem(
                LOCAL_STORAGE_GAME_STATE,
                JSON.stringify(updatedState)
            );
            return updatedState;
        }),

    /**
     *
     * @returns
     */
    newGame: () =>
        set((state) => {
            const config = useGameModeStore.getState().gameModeBoardConfig;

            const board = initBoard(config);

            const newValue = generateTileValue({}, {}, 0);
            board[config.startRow][config.startCol] = {
                id: `tile_${0}`,
                value: newValue,
                isNew: true,
                isMerge: false,
            };

            const locations = convertBoardToLocations(
                    board,
                    initIntermediateBoard(config),
                    config
                );

            const updatedState = {
                ...state,
                board: board,
                initTileLocations: locations,
                tileLocations: locations,
                prevTileLocations: {},
                hasStarted: true,
                isGameOver: false,
                showGameOverDialog: false,
                score: 0,
                moves: 0,
                merged: {},
                generated: {},
                nextValue: generateTileValue({}, {}, 0),
                currentGameId: uuid.v4() as string,
            };
            AsyncStorage.setItem(
                LOCAL_STORAGE_GAME_STATE,
                JSON.stringify(updatedState)
            );
            return updatedState;
        }),

    /**
     *
     * @returns
     */
    restoreState: async () => {
        const restoredStateStr = await AsyncStorage.getItem(
            LOCAL_STORAGE_GAME_STATE
        );
        set((state) => {
            if (restoredStateStr) {
                return {
                    ...state,
                    ...JSON.parse(restoredStateStr),
                    prevTileLocations: {},
                };
            } else {
                return {...state};
            }
        });
    },

    /**
     *
     * @returns
     */
    openGameOverDialog: () =>
        set((state) => ({...state, showGameOverDialog: true})),

    /**
     *
     * @returns
     */
    closeGameOverDialog: () =>
        set((state) => ({...state, showGameOverDialog: false})),
}));

export default useGameStore;
