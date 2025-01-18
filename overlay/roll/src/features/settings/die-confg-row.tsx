import { EntityId } from "@reduxjs/toolkit";
import { clamp, defaultTo, isEmpty, isNil, toInteger } from "lodash";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { settingsActions, settingsSelectors } from "./settings-slice";
import { DieConfig } from "./settings-model";

export const MAX_INT_32 = 2147483647;

interface Props {
    die: EntityId;
}

const DieConfigRow: React.FC<Props> = ({ die }) => {
    const config = useAppSelector(settingsSelectors.dieSelectorById(die));
    const dispatch = useAppDispatch();

    if (isNil(config)) {
        return null;
    }

    const update = (p: Partial<DieConfig>) => dispatch(settingsActions.updateConfig({ id: die, changes: p }));

    const updateSides = (value: string) => {
        const sides = clamp(toInteger(value), 1, MAX_INT_32);
        update({ sides });
    }

    const updateCount = (value: string) => {
        const count = clamp(toInteger(value), 1, MAX_INT_32);
        update({ count });
    }

    return (
        <tr>
            <td className="text-align-right">{die}</td>
            <td>
                <input type='text' value={defaultTo(config.label, '')}
                    className='die-row-text label'
                    onChange={e => update({ label: e.target.value })}></input>
            </td>
            <td>
                <input type='number' value={config.sides}
                    min={1} max={MAX_INT_32}
                    onChange={e => updateSides(e.target.value)}></input>
            </td>
            <td>
                <input type='number' value={config.count}
                    min={1} max={MAX_INT_32}
                    onChange={e => updateCount(e.target.value)} />
            </td>
            <td>
                <input type='search' value={defaultTo(config.icon, '')}
                    className='die-row-text'
                    placeholder="Custom Icon URI..."
                    onChange={e => update({ icon: isEmpty(e.target.value) ? undefined : e.target.value })} />
            </td>
            <td>
                <input type='search' value={defaultTo(config.expression, '')}
                    className='die-row-text'
                    placeholder="Extra args..."
                    onChange={e => update({ expression: isEmpty(e.target.value) ? undefined : e.target.value })} />
            </td>
            <td>
                <button title='Remove Die'
                    className='config-button config-button-remove'
                    onClick={e => dispatch(settingsActions.removeConfig(die))}>-</button>
            </td>
        </tr>
    )
}

export default DieConfigRow;