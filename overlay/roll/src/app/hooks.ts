import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import { store, AppDispatch, RootState } from "./store";
import { settingsActions } from "../features/settings/settings-slice";
import { SettingsDto } from "../features/settings/settings-model";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;


export const updateSettings = (dto: SettingsDto) => {
    store.dispatch(settingsActions.setSettings(dto));
}