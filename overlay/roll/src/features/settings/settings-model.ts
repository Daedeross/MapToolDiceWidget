import { EntityId } from "@reduxjs/toolkit";

export enum Position {
    TopLeft,
    TopRight,
    BottomLeft,
    BottomRight
}

export interface ButtonProperties {
    size: number;
    radius: number;
}

export interface DieConfig {
    id: EntityId;
    sides: number;
    count: number;
    label?: string;
    icon?: string;
    expression?: string;
}

export interface PseudoDieConfig {
    show: boolean;
    label?: string;
    icon?: string;
}

export interface GlobalSettingsDto {
    advantage: PseudoDieConfig;
    modifier: PseudoDieConfig;
    highIsGood: boolean;
    availableDice: Array<DieConfig>;
    macro: string;
    library: string;
    macroURI?: string | null;
    extraArgs?: string | null;
}

export interface UserSettingsDto {
    position: Position;
    buttonProperties: ButtonProperties;
}

export interface SettingsDto {
    isGM: boolean;
    user: UserSettingsDto;
    global: GlobalSettingsDto;
}