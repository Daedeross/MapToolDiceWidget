import { defaultTo } from 'lodash';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { rollActions, rollSelectors } from '../rolls/rolls-slice';
import { EntityId } from '@reduxjs/toolkit';
import { settingsSelectors } from '../settings/settings-slice';

interface Props {
    die: EntityId;
}

const DieButton: React.FC<Props> = ({ die }) => {
    const config = useAppSelector(settingsSelectors.dieSelectorById(die));
    const dieState = useAppSelector(rollSelectors.dieSelectorById(die));
    const count = dieState?.count;

    const dispatch = useAppDispatch();

    const handleClick = (button: number) => {
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

    return (
        <div className='dice-die-button' data-dice={die}
             onContextMenu={e => { e.preventDefault(); handleClick(2); return false; }}
             onClick={e => handleClick(e.button)}>
            <span className={`dice-icon-die dice-icon-die--${die}`} style={style}>
            </span>
            {count ? <div className="dice-die-button__count">{count}</div> : undefined}
            <div className='dice-die-button__tooltip'>
                <div className='dice-die-button__tooltip__pip' />
                {defaultTo(config?.label, `d${config?.sides}`)}
            </div>
        </div>
    );
}

export default DieButton;