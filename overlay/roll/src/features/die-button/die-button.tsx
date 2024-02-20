import { defaultTo, isEmpty, isNil } from 'lodash';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { rollActions, rollSelectors } from '../rolls/rolls-slice';
import { EntityId } from '@reduxjs/toolkit';
import { settingsSelectors } from '../settings/settings-slice';
import { useState } from 'react';
import D12 from '../../resources/d4.svg';

const NO_BUTTON = 0;
const LEFT_BUTTON = 1;
const MIDDLE_BUTTON = 2;
const RIGHT_BUTTON = 4;

interface Props {
    die: EntityId;
}

const POLYHEDRALS = [ 'd4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100'];

const DieButton: React.FC<Props> = ({ die }) => {
    const [buttons, setButtons] = useState(0);
    const config = useAppSelector(settingsSelectors.dieSelectorById(die));
    const dieState = useAppSelector(rollSelectors.dieSelectorById(die));
    const count = dieState?.count;

    const dispatch = useAppDispatch();

    const getMask = (button: number) => {
        switch (button) {
            case 0: return LEFT_BUTTON;
            case 1: return MIDDLE_BUTTON;
            case 2: return RIGHT_BUTTON;
            default: return NO_BUTTON;
        }
    }

    const onMouseDown = (button: number) => {
        setButtons(buttons | getMask(button));
    }

    const onMouseUp = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        const button = e.button;
        const mask = getMask(button);
        const capture = mask & buttons;
        const increment = (e.ctrlKey ? 2 : 1) * (e.shiftKey ? 5 : 1);
        const oldCount = defaultTo(count, 0);
        if (capture & LEFT_BUTTON) {
            dispatch(rollActions.setDie({id:die, count:oldCount + increment}))
        }
        if (capture & RIGHT_BUTTON) {
            dispatch(rollActions.setDie({id:die, count:oldCount - increment}));
        }
        setButtons(buttons - mask);
    }

    let className = 'dice-icon-die';
    if (POLYHEDRALS.includes(die.toString())) {
        className += `dice-icon-die--${die}`;
    }
    
    const content = isEmpty(config?.icon)
        ? <span>{defaultTo(config?.label, config?.id)}</span>
        : <img src={config?.icon} />

    return (
        <div className='dropdown-die-button die-button' data-dice={die}
             onMouseUp={e => onMouseUp(e)}
             onMouseDown={e => onMouseDown(e.button)}
             onContextMenu={e => { e.preventDefault(); return false; }}
             >
            {content}
            {count ? <div className="die-button__count">{count}</div> : undefined}
            <div className='die-button__tooltip'>
                <div className='die-button__tooltip__pip' />
                {defaultTo(config?.label, `d${config?.sides}`)}
            </div>
        </div>
    );
}

export default DieButton;