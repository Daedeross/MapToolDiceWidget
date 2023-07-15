import { createEntityAdapter, createSlice, isAnyOf } from '@reduxjs/toolkit';
import type { AnyAction, EntityId, EntityState, PayloadAction, Update } from '@reduxjs/toolkit';

import { MacroOutput } from '../../app/linker';
import { RootState } from '../../app/store';
import { setStyleVariable } from '../../app/utils';
import { ButtonProperties, DieConfig, Position, SettingsDto } from './settings-model';
import { defaultTo, filter, isEmpty, isNil } from 'lodash';

const LIB_NAMESPACE = 'daedeross.roll';
const DEFAULT_ROLL_MACRO = 'executeRoll';
const DEFAULT_MARGIN = 10;
const TOOLBAR_MARGIN = `${DEFAULT_MARGIN}px`;
const INITIAL = 'initial';

const polyhedrals: Array<DieConfig> = [4, 6, 8, 10, 12, 20]
    .map(num => {
        const id = `d${num}`;
        return { id, sides: num, label: id, icon: `--icon-${id}` };
    });

export interface SettingsState {
    position: Position;
    buttonProperties: ButtonProperties;
    availableDice: EntityState<DieConfig>;
    highIsGood: boolean;
    macro: string;
    library: string;
    macroURI?: string | null;
    macroOutput: MacroOutput;
}

export const dieConfigAdapter = createEntityAdapter<DieConfig>();

const initialState: SettingsState = {
    position: Position.BottomLeft,
    buttonProperties: {
        size: 50,
        radius: 25
    },
    highIsGood: true,
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
            state.position = action.payload.position;
            state.buttonProperties = action.payload.buttonProperties;
            state.highIsGood = action.payload.highIsGood;
            dieConfigAdapter.setAll(state.availableDice, action.payload.availableDice);
            state.macro = action.payload.macro;
            state.library = action.payload.library;
            state.macroURI = action.payload.macroURI;
        },
        setPosition: (state: SettingsState, action: PayloadAction<Position>) => {
            state.position = action.payload;
            setPositionCss(action.payload, state.buttonProperties);
        },
        setHighIsGood: (state: SettingsState, action: PayloadAction<boolean>) => {
            state.highIsGood = action.payload;
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
        updateConfig: (state: SettingsState, action: PayloadAction<Update<DieConfig>>) => {
            dieConfigAdapter.updateOne(state.availableDice, action.payload);
        },
        addConfig: (state: SettingsState, action: PayloadAction<DieConfig>) => {
            dieConfigAdapter.addOne(state.availableDice, action.payload);
        },
        removeConfig: (state: SettingsState, action: PayloadAction<EntityId>) => {
            dieConfigAdapter.removeOne(state.availableDice, action.payload);
        }
    }
});

function setPositionCss(position: Position, buttonProperties: ButtonProperties) {
    const buttonSize = `${buttonProperties.size}px`;
    switch (position) {
        case Position.TopLeft:
            setStyleVariable('--toolbar-left', TOOLBAR_MARGIN);
            setStyleVariable('--toolbar-right', INITIAL);
            setStyleVariable('--toolbar-top', TOOLBAR_MARGIN);
            setStyleVariable('--toolbar-bottom', INITIAL);

            setStyleVariable('--dropdown-top', buttonSize);
            setStyleVariable('--dropdown-bottom', INITIAL);
            break;
        case Position.TopRight:
            setStyleVariable('--toolbar-left', INITIAL);
            setStyleVariable('--toolbar-right', TOOLBAR_MARGIN );
            setStyleVariable('--toolbar-top', TOOLBAR_MARGIN);
            setStyleVariable('--toolbar-bottom', INITIAL);

            setStyleVariable('--dropdown-top', buttonSize);
            setStyleVariable('--dropdown-bottom', INITIAL);
            break;
        case Position.BottomLeft:
            setStyleVariable('--toolbar-left', TOOLBAR_MARGIN);
            setStyleVariable('--toolbar-right', INITIAL);
            setStyleVariable('--toolbar-top', INITIAL);
            setStyleVariable('--toolbar-bottom', TOOLBAR_MARGIN);

            setStyleVariable('--dropdown-top', INITIAL);
            setStyleVariable('--dropdown-bottom', buttonSize);
            break;
        case Position.BottomRight:
            setStyleVariable('--toolbar-left', INITIAL);
            setStyleVariable('--toolbar-right', TOOLBAR_MARGIN);
            setStyleVariable('--toolbar-top', INITIAL);
            setStyleVariable('--toolbar-bottom', TOOLBAR_MARGIN);

            setStyleVariable('--dropdown-top', INITIAL);
            setStyleVariable('--dropdown-bottom', buttonSize);
            break;
    }
}

export function extractDto(state: SettingsState): SettingsDto {
    return {
        position: state.position,
        highIsGood: state.highIsGood,
        macro: state.macro,
        library: state.library,
        macroURI: state.macroURI,
        buttonProperties: state.buttonProperties,
        availableDice: filter(Object.values(state.availableDice.entities), obj => isNil(obj)) as DieConfig[]
    }
}

export const settingsActions = { ...settingsSlice.actions }

const adapter_selectors = dieConfigAdapter.getSelectors((state: RootState) => state.settings.availableDice);

export const settingsSelectors = {
    ...adapter_selectors,
    dieSelectorById: (id: EntityId) => (state: RootState) => adapter_selectors.selectById(state, id),
    settings: (state: RootState) => state.settings,
    position: (state: RootState) => state.settings.position,
    highIsGood: (state: RootState) => state.settings.highIsGood,
    macroName: (state: RootState) => state.settings.macro,
    libraryName: (state: RootState) => state.settings.library,
    macroOutput: (state: RootState) => state.settings.macroOutput,
    buttonProperties: (state: RootState) => state.settings.buttonProperties
}

export default settingsSlice.reducer;