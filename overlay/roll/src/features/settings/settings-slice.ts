import { createEntityAdapter, createSlice, isAnyOf } from '@reduxjs/toolkit';
import type { AnyAction, EntityId, EntityState, PayloadAction, Update } from '@reduxjs/toolkit';

import { MacroOutput } from '../../app/linker';
import { RootState } from '../../app/store';
import { setStyleVariable } from '../../app/utils';
import { ButtonProperties, DieConfig, Position, PseudoDieConfig, SettingsDto } from './settings-model';
import { defaultTo, filter, isEmpty, isNil } from 'lodash';

const LIB_NAMESPACE = 'daedeross.roll';
const DEFAULT_ROLL_MACRO = 'executeRoll';
const DEFAULT_MARGIN = 10;
const TOOLBAR_MARGIN = `${DEFAULT_MARGIN}px`;
const INITIAL = 'initial';
const RESOURCE_URI =
    // (process.env.NODE_ENV == 'development')
    // ? "./resources/"
    // :
    `lib://${LIB_NAMESPACE}/`;

const polyhedrals: Array<DieConfig> = [4, 6, 8, 10, 12, 20]
    .map(num => {
        const id = `d${num}`;
        return { id, sides: num, count: 1, label: id, icon: `${RESOURCE_URI}img/${id}.png` };
    });

export interface SettingsState {
    isGM: boolean;
    position: Position;
    buttonProperties: ButtonProperties;
    availableDice: EntityState<DieConfig>;
    highIsGood: boolean;
    advantage: PseudoDieConfig;
    modifier: PseudoDieConfig;
    macro: string;
    library: string;
    macroURI?: string | null;
    macroOutput: MacroOutput;
    extraArgs?: string;
}

export const dieConfigAdapter = createEntityAdapter<DieConfig>();

const initialState: SettingsState = {
    isGM: false,
    position: Position.BottomLeft,
    buttonProperties: {
        size: 50,
        radius: 25
    },
    highIsGood: true,
    modifier: {
        label: "+/-",
        show: true
    },
    advantage: {
        label: "Adv.",
        show: true
    },
    availableDice: dieConfigAdapter.setAll(dieConfigAdapter.getInitialState(), polyhedrals),
    macro: DEFAULT_ROLL_MACRO,
    library: LIB_NAMESPACE,
    macroOutput: 'all'
};

const isSettingsAction = (action: AnyAction) => {
    return action.type.startsWith(settingsSlice.name);
}

export const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        setSettings: (state: SettingsState, action: PayloadAction<SettingsDto>) => {
            state.isGM = action.payload.isGM;
            state.position = action.payload.user.position;
            state.buttonProperties = action.payload.user.buttonProperties;
            state.advantage = action.payload.global.advantage;
            state.modifier = action.payload.global.modifier;
            state.highIsGood = action.payload.global.highIsGood;
            dieConfigAdapter.setAll(state.availableDice, action.payload.global.availableDice);
            state.macro = action.payload.global.macro;
            state.library = action.payload.global.library;
            state.macroURI = action.payload.global.macroURI;
            if (isNil(action.payload.global.extraArgs)) {
                delete state.extraArgs;
            } else {
                state.extraArgs = action.payload.global.extraArgs;
            }
            setCssVariables(state.position, state.buttonProperties);
        },
        setPosition: (state: SettingsState, action: PayloadAction<Position>) => {
            state.position = action.payload;
            setCssVariables(action.payload, state.buttonProperties);
        },
        setAdvantage: (state: SettingsState, action: PayloadAction<PseudoDieConfig>) => {
            state.advantage = action.payload;
        },
        setHighIsGood: (state: SettingsState, action: PayloadAction<boolean>) => {
            state.highIsGood = action.payload;
        },
        setModifier: (state: SettingsState, action: PayloadAction<PseudoDieConfig>) => {
            state.modifier = action.payload;
        },
        setMacroName: (state: SettingsState, action: PayloadAction<string | null | undefined>) => {
            state.macro = defaultTo(action.payload, DEFAULT_ROLL_MACRO);
            if (isEmpty(state.macro)) {
                state.macro = DEFAULT_ROLL_MACRO;
            }
        },
        setLibraryName: (state: SettingsState, action: PayloadAction<string | null | undefined>) => {
            state.library = defaultTo(action.payload, LIB_NAMESPACE);
            if (isEmpty(state.library)) {
                state.library = LIB_NAMESPACE;
            }
        },
        setMacroOutput: (state: SettingsState, action: PayloadAction<MacroOutput>) => {
            state.macroOutput = action.payload;
        },
        setButtonProperties: (state: SettingsState, action: PayloadAction<ButtonProperties>) => {
            state.buttonProperties = action.payload;
            setCssVariables(state.position, state.buttonProperties);
        },
        updateConfig: (state: SettingsState, action: PayloadAction<Update<DieConfig>>) => {
            dieConfigAdapter.updateOne(state.availableDice, action.payload);
        },
        addConfig: (state: SettingsState, action: PayloadAction<DieConfig>) => {
            dieConfigAdapter.addOne(state.availableDice, action.payload);
        },
        removeConfig: (state: SettingsState, action: PayloadAction<EntityId>) => {
            dieConfigAdapter.removeOne(state.availableDice, action.payload);
        },
        setExtraArgs: (state: SettingsState, action: PayloadAction<string>) => {
            if (isNil(action.payload)) {
                delete state.extraArgs;
            } else {
                state.extraArgs = action.payload;
            }
        }
    }
});

function setCssVariables(position: Position, buttonProperties: ButtonProperties) {
    const buttonSize = `${buttonProperties.size}px`;
    const buttonRadius = `${buttonProperties.radius}px`;
    setStyleVariable('--button-size', buttonSize);
    setStyleVariable('--button-radius', buttonRadius);
    switch (position) {
        case Position.TopLeft:
            setStyleVariable('--toolbar-left', TOOLBAR_MARGIN);
            setStyleVariable('--toolbar-right', INITIAL);
            setStyleVariable('--toolbar-top', TOOLBAR_MARGIN);
            setStyleVariable('--toolbar-bottom', INITIAL);

            setStyleVariable('--dropdown-top', buttonSize);
            setStyleVariable('--dropdown-bottom', INITIAL);
            setStyleVariable('--roll-button-radius', `0px ${buttonRadius} ${buttonRadius} 0px`);
            setStyleVariable('--target-direction', 'ltr');
            break;
        case Position.TopRight:
            setStyleVariable('--toolbar-left', INITIAL);
            setStyleVariable('--toolbar-right', TOOLBAR_MARGIN);
            setStyleVariable('--toolbar-top', TOOLBAR_MARGIN);
            setStyleVariable('--toolbar-bottom', INITIAL);

            setStyleVariable('--dropdown-top', buttonSize);
            setStyleVariable('--dropdown-bottom', INITIAL);
            setStyleVariable('--roll-button-radius', `${buttonRadius} 0px 0px ${buttonRadius}`);
            setStyleVariable('--target-direction', 'rtl');
            break;
        case Position.BottomLeft:
            setStyleVariable('--toolbar-left', TOOLBAR_MARGIN);
            setStyleVariable('--toolbar-right', INITIAL);
            setStyleVariable('--toolbar-top', INITIAL);
            setStyleVariable('--toolbar-bottom', TOOLBAR_MARGIN);

            setStyleVariable('--dropdown-top', INITIAL);
            setStyleVariable('--dropdown-bottom', buttonSize);
            setStyleVariable('--roll-button-radius', `0px ${buttonRadius} ${buttonRadius} 0px`);
            setStyleVariable('--target-direction', 'ltr');
            break;
        case Position.BottomRight:
            setStyleVariable('--toolbar-left', INITIAL);
            setStyleVariable('--toolbar-right', TOOLBAR_MARGIN);
            setStyleVariable('--toolbar-top', INITIAL);
            setStyleVariable('--toolbar-bottom', TOOLBAR_MARGIN);

            setStyleVariable('--dropdown-top', INITIAL);
            setStyleVariable('--dropdown-bottom', buttonSize);
            setStyleVariable('--roll-button-radius', `${buttonRadius} 0px 0px ${buttonRadius}`);
            setStyleVariable('--target-direction', 'rtl');
            break;
    }
}

const selectAllDiceConfigs = dieConfigAdapter.getSelectors((x: SettingsState) => x.availableDice).selectAll;

export function extractDto(state: SettingsState): SettingsDto {
    return {
        isGM: state.isGM,
        user: {
            position: state.position,
            buttonProperties: state.buttonProperties,
        },
        global: {
            advantage: state.advantage,
            highIsGood: state.highIsGood,
            modifier: state.modifier,
            macro: state.macro,
            library: state.library,
            macroURI: state.macroURI,
            availableDice: filter(Object.values(state.availableDice.entities), obj => !isNil(obj)) as DieConfig[],
            extraArgs: state.extraArgs,
        }
    }
}

export const settingsActions = { ...settingsSlice.actions }

const adapter_selectors = dieConfigAdapter.getSelectors((state: RootState) => state.settings.availableDice);

export const settingsSelectors = {
    ...adapter_selectors,
    dieSelectorById: (id: EntityId) => (state: RootState) => adapter_selectors.selectById(state, id),
    settings: (state: RootState) => state.settings,
    isGM: (state: RootState) => state.settings.isGM,
    position: (state: RootState) => state.settings.position,
    highIsGood: (state: RootState) => state.settings.highIsGood,
    modifier: (state: RootState) => state.settings.modifier,
    advantage: (state: RootState) => state.settings.advantage,
    macroName: (state: RootState) => state.settings.macro,
    libraryName: (state: RootState) => state.settings.library,
    macroOutput: (state: RootState) => state.settings.macroOutput,
    buttonProperties: (state: RootState) => state.settings.buttonProperties,
    extraArgs: (state: RootState) => state.settings.extraArgs,
}

export default settingsSlice.reducer;