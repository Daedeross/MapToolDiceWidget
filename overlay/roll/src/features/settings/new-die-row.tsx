import { useState } from "react";
import { isEmpty, toInteger } from "lodash";

import { settingsActions } from "./settings-slice";
import { MAX_INT_32 } from "./die-confg-row";
import { useAppDispatch } from "../../app/hooks";

const NewDieRow = () => {
    const [id, setId] = useState('');
    const [label, setLabel] = useState('');
    const [sides, setSides] = useState(1);
    const [count, setCount] = useState(1);
    const [icon, setIcon] = useState('');
    const [expression, setExpression] = useState('');

    const dispatch = useAppDispatch();

    const handleClick = () => {
        dispatch(settingsActions.addConfig({
            id,
            label,
            sides,
            count: 1,
            icon: isEmpty(icon) ? undefined : icon,
            expression: isEmpty(expression) ? undefined : expression
        }));
        setId('');
        setLabel('');
        setSides(1);
        setCount(1);
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
                   className='die-row-text label'
                   value={label}
                   onChange={e => setLabel(e.target.value)}></input>
        </td>
        <td>
            <input type='number' value={sides}
                   min={1} max={MAX_INT_32}
                   onChange={e => setSides(toInteger(e.target.value))}></input>
        </td>
        <td>
            <input type='number' value={sides}
                   min={1} max={MAX_INT_32}
                   onChange={e => setCount(toInteger(e.target.value))}></input>
        </td>
        <td>
            <input type='search' value={icon}
                   className='die-row-text'
                   placeholder="Custom Icon URI..."
                   onChange={e => setIcon(e.target.value)} />
        </td>
            <td>
                <input type='search' value={expression}
                       className='die-row-text'
                       placeholder="Extra args..."
                       onChange={e => setExpression(e.target.value)} />
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