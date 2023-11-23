import { defaultTo, isNil } from 'lodash';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { rollActions, rollSelectors } from '../rolls/rolls-slice';
import { EntityId } from '@reduxjs/toolkit';
import { settingsSelectors } from '../settings/settings-slice';
import { useState } from 'react';

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

    const onMouseUp = (button: number) => {
        const mask = getMask(button);
        const capture = mask & buttons;
        if (capture & LEFT_BUTTON) {
            dispatch(rollActions.addDie(die))
        }
        if (capture & RIGHT_BUTTON) {
            dispatch(rollActions.removeDie(die));
        }
        setButtons(buttons - mask);
    }

    const handleClick = (button: number) => {
        console.log(button);
        switch (button) {
            case 0:
                dispatch(rollActions.addDie(die));
                break;
            case 1:
            case 2:
            case 3:
                dispatch(rollActions.removeDie(die));
                break;
        }
    }

    const style = {
        maskImage: defaultTo(config?.icon, 'initial')
    }

    let className = 'dice-icon-die';
    if (POLYHEDRALS.includes(die.toString())) {
        className += `dice-icon-die--${die}`;
    }
    
    const content = isNil(config?.icon)
        ? <span>{defaultTo(config?.label, config?.id)}</span>
        : <img src={config?.icon} />

    return (
        <div className='dropdown-die-button die-button' data-dice={die}
             onMouseUp={e => onMouseUp(e.button)}
             onMouseDown={e => onMouseDown(e.button)}
             onContextMenu={e => { e.preventDefault(); return false; }}
            //  onClick={e => handleClick(e.button)}
            //  onClickCapture={e => handleClick(e.button)}
             >
            {content}
            {/* <img className={className} style={style} src='lib://daedeross.roll/img/d10.png' >
            </img> */}
            {count ? <div className="die-button__count">{count}</div> : undefined}
            <div className='die-button__tooltip'>
                <div className='die-button__tooltip__pip' />
                {defaultTo(config?.label, `d${config?.sides}`)}
            </div>
        </div>
    );
}

export default DieButton;