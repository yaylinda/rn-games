import AsyncStorage from '@react-native-async-storage/async-storage';
import create from 'zustand';

import { LAST_POSTED_GAME_ID } from '../utils/constants';
import type { HighScoreDoc } from '../types';

interface HighScoresState {
  showHighScoresDialog: boolean;
  posting: boolean;
  successfullyPosted: boolean;
  showPostScoreDialog: boolean;
  fetching: boolean;
  highScores: HighScoreDoc[];
  lastPostedGameId: string | null;
  init: () => void;
  openHighScoresDialog: () => void;
  closeHighScoresDialog: () => void;
  openPostScoreDialog: () => void;
  closePostScoreDialog: () => void;
  startPosting: () => void;
  resetPosting: () => void;
  setPostedSuccess: (gameId: string) => void;
  setPostedFailed: () => void;
  startFetchingHighScores: () => void;
  setHighScores: (highScores: HighScoreDoc[]) => void;
}

const useHighScoresStore = create<HighScoresState>()((set ) => ({
    showHighScoresDialog: false,
    posting: false,
    successfullyPosted: false,
    showPostScoreDialog: false,
    fetching: false,
    highScores: [],
    lastPostedGameId: null,

    init: async () => {
        const lastPostedGameId = await AsyncStorage.getItem(LAST_POSTED_GAME_ID);
        set((state) => {
            if (lastPostedGameId) {
                return {
                    ...state,
                    lastPostedGameId,
                };
            }
            return state;
        });
    },
    openHighScoresDialog: () =>
        set((state) => ({ ...state, showHighScoresDialog: true })),
    closeHighScoresDialog: () =>
        set((state) => ({ ...state, showHighScoresDialog: false })),
    openPostScoreDialog: () =>
        set((state) => ({ ...state, showPostScoreDialog: true })),
    closePostScoreDialog: () =>
        set((state) => ({ ...state, showPostScoreDialog: false })),
    resetPosting: () =>
        set((state) => ({ ...state, posting: false, successfullyPosted: false })),
    startPosting: () =>
        set((state) => ({ ...state, posting: true, successfullyPosted: false })),
    setPostedSuccess: (gameId: string) =>
        set((state) => {
            AsyncStorage.setItem(LAST_POSTED_GAME_ID, gameId);
            return {
                ...state,
                posting: false,
                successfullyPosted: true,
                lastPostedGameId: gameId,
                showPostScoreDialog: false,
            };
        }),
    setPostedFailed: () =>
        set((state) => ({
            ...state,
            posting: false,
            successfullyPosted: false,
            lastPostedGameId: null,
            showPostScoreDialog: false,
        })),
    startFetchingHighScores: () => set((state) => ({ ...state, fetching: true })),
    setHighScores: (highScores: HighScoreDoc[]) =>
        set((state) => ({
            ...state,
            fetching: false,
            highScores,
        })),
}));

export default useHighScoresStore;
