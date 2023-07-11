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
    label?: string | null;
    icon?: string | null;
    expression?: string | null;
}

export interface SettingsDto {
    position: Position;
    buttonProperties: ButtonProperties;
    availableDice: Array<DieConfig>;
    macro: string;
    library: string;
    macroURI?: string | null;
}