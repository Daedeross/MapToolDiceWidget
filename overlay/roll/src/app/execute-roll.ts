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
}

export const executeRoll = createAsyncThunk<void, unknown, { state: RootState }>(
    'roll/execute',
    async (arg: unknown, { getState, dispatch }) => {
        const state = getState();

        const dice = sortedMergeInnerJoin(
            rollSelectors.selectAll(state),
            (dieState) => dieState.id,
            settingsSelectors.selectAll(state),
            (config) => config.id);

        const args: RollArgs = {
            dice,
            modifier: state.roll.modifier,
            advantage: state.roll.advantage,
            highIsGood: state.settings.highIsGood,
        }

        const uri = state.settings.macroURI
            ? makeMacroLinkFromUri(state.settings.macroURI, state.settings.macroOutput, args, TARGET)
            : makeMacroLink(state.settings.macro, state.settings.macroOutput, args, TARGET, state.settings.library);

        console.log(uri);
        executeUri(uri);

        dispatch(rollActions.reset);
    }
)