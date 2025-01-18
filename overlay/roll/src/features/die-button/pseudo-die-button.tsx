import { isEmpty } from 'lodash';
import { useState } from 'react';

import { RootState } from '../../app/store';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { PseudoDieConfig } from '../settings/settings-model';
import { ActionCreatorWithPayload } from '@reduxjs/toolkit';

const NO_BUTTON = 0;
const LEFT_BUTTON = 1;
const MIDDLE_BUTTON = 2;
const RIGHT_BUTTON = 4;

interface Props {
    valueSelector: (state: RootState) => number;
    settingSelector: (state: RootState) => PseudoDieConfig;
    setter: ActionCreatorWithPayload<number>;
}

const PseudoDieButton: React.FC<Props> = (props) => {
    const [buttons, setButtons] = useState(0);
    const value = useAppSelector(props.valueSelector);
    const settings = useAppSelector(props.settingSelector);

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
        if (capture & LEFT_BUTTON) {
            dispatch(props.setter(value + increment));
        }
        if (capture & RIGHT_BUTTON) {
            dispatch(props.setter(value - increment));
        }
        setButtons(buttons - mask);
    }

    const style = {
        display: settings.show ? undefined : "none"
    }

    const content = isEmpty(settings.icon)
        ? <span>{settings.label}</span>
        : <img src={settings.icon}></img>;

    return (
        <div className='dropdown-die-button die-button'
            style={style}
            onMouseUp={e => onMouseUp(e)}
            onMouseDown={e => onMouseDown(e.button)}
            onContextMenu={e => { e.preventDefault(); return false; }}
        >
            {content}
            {value ? <div className="die-button__count">{value}</div> : undefined}
            <div className='die-button__tooltip'>
                <div className='die-button__tooltip__pip' />
                {settings.label}
            </div>
        </div>
    );
}

export default PseudoDieButton;