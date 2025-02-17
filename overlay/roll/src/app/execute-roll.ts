import { createAsyncThunk } from "@reduxjs/toolkit";
import { sortedMergeInnerJoin } from "lodash-joins";

import { RootState } from "./store";
import { settingsSelectors } from "../features/settings/settings-slice";
import { DieState, rollActions, rollSelectors } from "../features/rolls/rolls-slice";
import { DieConfig } from "../features/settings/settings-model";
import { executeUri, makeMacroLink, makeMacroLinkFromUri } from "./linker";

const TARGET = 'impersonated';

export interface RollArgs {
    dice: Array<DieState & DieConfig>;
    modifier: number;
    advantage: number;
    highIsGood: boolean;
    extraArgs?: string;
}

export const executeRoll = createAsyncThunk<void, void, { state: RootState }>(
    'roll/execute',
    async (arg: unknown, { getState, dispatch }) => {
        const state = getState();

        const dice = sortedMergeInnerJoin(
            rollSelectors.selectAll(state),
            (dieState) => dieState.id,
            settingsSelectors.selectAll(state),
            (config) => config.id,
            (dieState, config) => {
                return {
                    ...config,
                    ...dieState
                } as DieState & DieConfig;
            });

        const args: RollArgs = {
            dice,
            modifier: state.roll.modifier,
            advantage: state.roll.advantage,
            highIsGood: state.settings.highIsGood,
            extraArgs: state.settings.extraArgs,
        }

        const uri = state.settings.macroURI
            ? makeMacroLinkFromUri(state.settings.macroURI, state.settings.macroOutput, args, TARGET)
            : makeMacroLink(state.settings.macro, state.settings.macroOutput, args, TARGET, state.settings.library);

        executeUri(uri);

        dispatch(rollActions.reset);
    }
)