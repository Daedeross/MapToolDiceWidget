import { createAsyncThunk } from "@reduxjs/toolkit";

import { DieState } from "../features/rolls/rolls-slice";
import { DieConfig } from "../features/settings/settings-model";
import { executeMacroLink } from './linker';
import { isEmpty, isNil } from "lodash";

const UPDATE_MACRO = 'loadSampleSettings';

export interface RollArgs {
    dice: Array<DieState & DieConfig>;
    modifier: number;
    advantage: number;
    highIsGood: boolean;
}

export const loadSampleSettings = createAsyncThunk(
    'settings/load-sample',
    async (arg: string | null | undefined, { dispatch }) => {
        if (!isEmpty(arg)) {
            executeMacroLink(UPDATE_MACRO, 'none', { name: arg } , 'impersonated');
        }
    }
)