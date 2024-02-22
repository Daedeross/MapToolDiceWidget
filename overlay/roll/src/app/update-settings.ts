import { Action, Dispatch, ListenerEffectAPI } from '@reduxjs/toolkit';
import { compare } from 'fast-json-patch';
import { isEmpty, isEqual } from 'lodash';

import { RootState } from './store';
import { extractDto, settingsSlice } from '../features/settings/settings-slice';
import { executeMacroLink } from './linker';
import { GlobalSettingsDto, UserSettingsDto } from '../features/settings/settings-model';

const GLOBAL_MACRO = 'updateGlobalSettings';
const USER_MACRO = 'updateUserSettings';

export const isStateChanged = (action: Action, currentState: RootState, previousState: RootState) => !isEqual(currentState, previousState);
export const isSettingsChanged = (action: Action, currentState: RootState, previousState: RootState) => {
    return action.type.startsWith(settingsSlice.name)
            && !isEqual(currentState.settings, previousState.settings);
}

export const pushChangesToMapTool = (action: Action, listenerApi: ListenerEffectAPI<RootState, Dispatch> ) => {
    const lastState = listenerApi.getOriginalState();
    const newState = listenerApi.getState();
    const lastDto = extractDto(lastState.settings);
    const newDto = extractDto(newState.settings);

    pushUserSettings(lastDto.user, newDto.user);
    if(lastDto.isGM) {
        pushGlobalSettings(lastDto.global, newDto.global);
    }
};

const pushUserSettings = (lastDto: UserSettingsDto, newDto: UserSettingsDto) => {
    const diff = compare(lastDto, newDto);
    if (isEmpty(diff)) {
        return;
    }

    executeMacroLink(USER_MACRO, 'none', newDto, 'impersonated');
}

const pushGlobalSettings = (lastDto: GlobalSettingsDto, newDto: GlobalSettingsDto) => {
    const diff = compare(lastDto, newDto);
    if (isEmpty(diff)) {
        return;
    }
    
    executeMacroLink(GLOBAL_MACRO, 'none', newDto, 'impersonated');
}