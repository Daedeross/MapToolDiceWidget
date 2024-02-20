import { defaultTo, isEmpty } from "lodash";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { settingsActions, settingsSelectors } from "./settings-slice";
import { PseudoDieConfig } from "./settings-model";

function PseudoDieConfigTable() {
    const advantage = useAppSelector(settingsSelectors.advantage);
    const modifier = useAppSelector(settingsSelectors.modifier);
    const dispatch = useAppDispatch();

    const updateAdvantage = (state: PseudoDieConfig) => dispatch(settingsActions.setAdvantage(state));
    const updateModifier = (state: PseudoDieConfig) => dispatch(settingsActions.setModifier(state));

    return (
        <div>
            <h3>Additional Buttons</h3>
            <table>
                <thead>
                    <tr>
                        <th>Button</th><th>Show/Hide</th><th>Label</th><th>Icon</th>
                    </tr>
                </thead>
                <tbody>
                    <tr title="Settings for extra button for adding/subtrcting flat values to the roll (e.g. the '+3' in 2d6+3).">
                        <td>Flat Modifier</td>
                        <td>
                            <input type="checkbox" id="showModifier" value="showModifier"
                                   checked={modifier.show}
                                   onChange={e => updateModifier({ ...modifier, show: !modifier.show})}/>
                        </td>
                        <td>
                            <input type='text' value={defaultTo(modifier.label, '')}
                                   className='die-row-text label'
                                   onChange={e => updateModifier({ ...modifier, label: e.target.value})}></input>
                        </td>
                        <td>
                            <input type='search' value={defaultTo(modifier.icon, '')}
                                   className='die-row-text'
                                   placeholder="Custom Icon URI..."
                                   onChange={e => updateModifier({ ...modifier, icon: isEmpty(e.target.value) ? undefined : e.target.value })} />
                        </td>
                    </tr>
                    <tr title="Settings for extra button for setting levels of Advantage/Disadvantage.">
                        <td>Advantage</td>
                        <td>
                            <input type="checkbox" id="showAdvantage" value="showAdvantage"
                                   checked={advantage.show}
                                   onChange={e => updateAdvantage({ ...advantage, show: !advantage.show})}/>
                        </td>
                        <td>
                            <input type='text' value={defaultTo(advantage.label, '')}
                                   className='die-row-text label'
                                   onChange={e => updateAdvantage({ ...advantage, label: e.target.value})}></input>
                        </td>
                        <td>
                            <input type='search' value={defaultTo(advantage.icon, '')}
                                   className='die-row-text'
                                   placeholder="Custom Icon URI..."
                                   onChange={e => updateAdvantage({ ...advantage, icon: isEmpty(e.target.value) ? undefined : e.target.value })} />
                        </td>
                    </tr>
                </tbody> 
            </table>
        </div>
    )
}

export default PseudoDieConfigTable;