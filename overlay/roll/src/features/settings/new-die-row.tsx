import { useState } from "react";
import { isEmpty, toInteger } from "lodash";

import { settingsActions } from "./settings-slice";
import { MAX_INT_32 } from "./die-confg-row";
import { useAppDispatch } from "../../app/hooks";

const NewDieRow = () => {
    const [id, setId] = useState('');
    const [label, setLabel] = useState('');
    const [sides, setSides] = useState(1);
    const [icon, setIcon] = useState('');

    const dispatch = useAppDispatch();

    const handleClick = () => {
        dispatch(settingsActions.addConfig({
            id,
            label,
            sides,
            icon: isEmpty(icon) ? undefined : icon
        }));
        setId('');
        setLabel('');
        setSides(1);
        setIcon('');
    }

    return (
        <tr>
        <td className='text-align-right'>
            <input type='text' placeholder='id'
                   style={{maxWidth:32}}
                   value={id}
                   onChange={e => setId(e.target.value)}></input>
        </td>
        <td>
            <input type='text' placeholder='label'
                   value={label}
                   onChange={e => setLabel(e.target.value)}></input>
        </td>
        <td>
            <input type='number' value={sides}
                   min={1} max={MAX_INT_32}
                   onChange={e => setSides(toInteger(e.target.value))}></input>
        </td>
        <td>
            <input type='search' value={icon}
                   onChange={e => setIcon(e.target.value)} />
        </td>
        <td>
            <button disabled={isEmpty(id) || sides < 1}
                    title='Add Die'
                    className='config-button config-button-add'
                    onClick={e => handleClick() }>+</button>
        </td>
    </tr>
    )
}

export default NewDieRow;