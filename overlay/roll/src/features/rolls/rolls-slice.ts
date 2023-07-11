import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import type { EntityId, EntityState, PayloadAction } from '@reduxjs/toolkit'
import { get, isInteger, reduce } from 'lodash';

import { RootState } from '../../app/store';

export interface DieState {
    id: EntityId,
    count: number,
}

export interface RollState {
    dice: EntityState<DieState>;
    modifier: number;
    advantage: number;
}

export const dieStateAdapter = createEntityAdapter<DieState>();

const initialState: RollState = {
    dice: dieStateAdapter.getInitialState(),
    modifier: 0,
    advantage: 0
}

export const dieExpression = (value: any, index: any) => {
    if (isInteger(value) && value > 0) {
        return `${value}d${index}`;
    } else {
        return '';
    }
}

export const constructExpression = (state: RollState): string => {
    const dice = reduce(state.dice, (acc, value, index) => acc + dieExpression(value, index), '');
    const modifier = state.modifier > 0
                     ? `+${state.modifier}`
                     : state.modifier < 0 
                        ? `${state.modifier}`
                        : '';
    // TODO: Advantage;
    return dice + modifier;
}

export const rollSlice = createSlice({
    name: 'roll',
    initialState,
    reducers: {
        reset: (state: RollState, action: PayloadAction) => {
            return initialState;
        },
        addDie: (state: RollState, action: PayloadAction<EntityId>) => {
            var die = get(state.dice.entities, action.payload, { id: action.payload, count: 0 });
            die.count++;
            dieStateAdapter.setOne(state.dice, die);
        },
        removeDie: (state: RollState, action: PayloadAction<EntityId>) => {
            var die = get(state.dice.entities, action.payload, { id: action.payload, count: 0 });
            die.count--;
            if (die.count <= 0) {
                dieStateAdapter.removeOne(state.dice, action.payload);
            } else {
                dieStateAdapter.setOne(state.dice, die);
            }
        },
        clearDice: (state: RollState, action: PayloadAction) => {
            dieStateAdapter.removeAll(state.dice);
        },
        setModifier: (state: RollState, action: PayloadAction<number>) => {
            state.modifier = action.payload;
        },
        setAdvantage: (state: RollState, action: PayloadAction<number>) => {
            state.advantage = action.payload;
        }
    }
});


export const rollActions = { ...rollSlice.actions };

const adapter_selectors = dieStateAdapter.getSelectors((state: RootState) => state.roll.dice);

export const selectRoll = (state: RootState) => {
    return state.roll;
}

export const rollSelectors = {
    ...adapter_selectors,
    dieSelectorById: (id: EntityId) => (state:RootState) => adapter_selectors.selectById(state, id),
    selectModifier: (state: RootState) => selectRoll(state).modifier,
    selectAdvantage: (state: RootState) => selectRoll(state).advantage,
    selectIsAnyDice: (state: RootState) => selectRoll(state).dice.ids.length > 0,
}

export default rollSlice.reducer;