import { ReactElement, useState } from "react";
import { isEmpty, toInteger } from "lodash";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { settingsActions, settingsSelectors } from "./settings-slice";
import { Position } from "./settings-model";
import DieConfigRow from "./die-confg-row";
import NewDieRow from "./new-die-row";

function SettingsPanel(): ReactElement {
    const position = useAppSelector(settingsSelectors.position);
    const highIsGood = useAppSelector(settingsSelectors.highIsGood);
    const dice = useAppSelector(settingsSelectors.selectAll);

    const dispatch = useAppDispatch();

    const diceProps = dice.map(d => {
        return <DieConfigRow key={d.id} die={d.id} />
    });

    return (
        <div className="settings-panel">
            <label htmlFor="position">Widget Position</label>
            <select name="position" id="settings-position-select" value={position}
                onChange={e => dispatch(settingsActions.setPosition(Number(e.target.value)))}>
                <option value={Position.BottomLeft}>BottomLeft</option>
                <option value={Position.TopLeft}>TopLeft</option>
                <option value={Position.TopRight}>TopRight</option>
                <option value={Position.BottomRight}>BottomRight</option>
            </select>
            <div>
                <h3>Available Dice</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Id</th><th>Label</th><th>Sides</th>
                        </tr>
                    </thead>
                    <tbody>
                        {diceProps}
                        <NewDieRow />
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default SettingsPanel;