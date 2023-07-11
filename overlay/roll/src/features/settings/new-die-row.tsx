import { useState } from "react";
import { isEmpty, toInteger } from "lodash";

import { settingsActions } from "./settings-slice";
import { MAX_INT_32 } from "./die-confg-row";
import { useAppDispatch } from "../../app/hooks";

const NewDieRow =() => {
    const [id, setId] = useState('');
    const [label, setLabel] = useState('');
    const [sides, setSides] = useState(1);
    
    const dispatch = useAppDispatch();
    
    return (
        
        <tr>
        <td className="text-align-right">
            <input type="text" placeholder="id"
                   style={{maxWidth:32}}
                   value={id}
                   onChange={e => setId(e.target.value)}></input>
        </td>
        <td>
            <input type='text' placeholder="label"
                   value={label}
                   onChange={e => setLabel(e.target.value)}></input>
        </td>
        <td>
            <input type='number' value={sides}
                min={1} max={MAX_INT_32}
                onChange={e => setSides(toInteger(e.target.value))}></input>
        </td>
        <td>
            <button
                disabled={isEmpty(id) || sides < 1}
                onClick={e => dispatch(settingsActions.addConfig({
                id,
                label,
                sides
            }))}>+</button>
        </td>
    </tr>
    )
}

export default NewDieRow;