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

export interface SettingsDto {
    position: Position;
    buttonProperties: ButtonProperties;
    advantage: PseudoDieConfig;
    modifier: PseudoDieConfig;
    highIsGood: boolean;
    availableDice: Array<DieConfig>;
    macro: string;
    library: string;
    macroURI?: string | null;
}