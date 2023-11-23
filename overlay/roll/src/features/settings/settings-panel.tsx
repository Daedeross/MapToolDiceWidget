import { ReactElement, useState } from "react";
import { flow, toInteger } from "lodash";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { settingsActions, settingsSelectors } from "./settings-slice";
import { Position } from "./settings-model";
import DieConfigTable from "./dice-config-tabel";
import { MacroOutput, MacroOutputs } from "../../app/linker";

function SettingsPanel(): ReactElement {
    const [active, setActive] = useState(false);

    const position = useAppSelector(settingsSelectors.position);
    const highIsGood = useAppSelector(settingsSelectors.highIsGood);
    const macroName = useAppSelector(settingsSelectors.macroName);
    const libraryName = useAppSelector(settingsSelectors.libraryName);
    const macroOutput = useAppSelector(settingsSelectors.macroOutput);
    const buttonSettings = useAppSelector(settingsSelectors.buttonProperties);

    const dispatch = useAppDispatch();

    const outputOptions = MacroOutputs.map(o => <option key={o}>{o}</option>);

    const handleOutputChange = (p: MacroOutput) => {
        dispatch(settingsActions.setMacroOutput(p))
    }

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
            <label htmlFor="highIsGood" title="If checked, advantageous re-rolls take the highest result and disadvantageous re-rolls take the lowest. And vice-versa when unchecked.">Advantage High</label>
            <input type="checkbox" id="highIsGood" value="highIsGood"
                checked={highIsGood} onChange={e => dispatch(settingsActions.setHighIsGood(!highIsGood))}
                title="If checked, advantageous re-rolls take the highest result and disadvantageous re-rolls take the lowest. And vice-versa when unchecked." />
            <DieConfigTable />
            <button className={'expander' + (active ? ' active' : '')} onClick={e => setActive(!active)}>Advanced Settings</button>
            <div className="expander" style={{display: active ? 'block' : 'none'}}>
                <table>
                    <tbody>
                        <tr>
                            <td><label htmlFor="macroNameInput">Macro Name</label></td>
                            <td><input type="search" id="macroNameInput"
                                value={macroName} onChange={e => dispatch(settingsActions.setMacroName(e.target.value))} /></td>
                        </tr>
                        <tr>
                            <td><label htmlFor="libraryNameInput">Library Name</label></td>
                            <td><input type="search" id="libraryNameInput"
                                value={libraryName} onChange={e => dispatch(settingsActions.setLibraryName(e.target.value))} /></td>
                        </tr>
                        <tr>
                            <td><label htmlFor="macroOutputInput">Macro Output</label></td>
                            <td>
                                <select id="macroOutputInput"
                                        value={macroOutput} onChange={e => handleOutputChange(e.target.value)}>
                                    {outputOptions}
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td><label>Buttons</label></td>
                            <td><label htmlFor="buttonSizeInput">Size</label> <input type="number" id="buttonSizeInput"
                                    value={buttonSettings.size} onChange={e => dispatch(settingsActions.setButtonProperties({...buttonSettings, size: toInteger(e.target.value)}))} />
                                <label htmlFor="buttonRadiusInput">Radius</label> <input type="number" id="buttonRadiusInput"
                                    value={buttonSettings.radius} onChange={e => dispatch(settingsActions.setButtonProperties({...buttonSettings, radius: toInteger(e.target.value)}))} />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default SettingsPanel;