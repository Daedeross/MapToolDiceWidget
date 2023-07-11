import { ReactElement, useState } from 'react';
import ReactModal from 'react-modal';

import DieButton from '../die-button/die-button';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { settingsSelectors } from '../settings/settings-slice';
import SettingsPanel from '../settings/settings-panel';
import { Position } from '../settings/settings-model';
import { rollActions } from './rolls-slice';

function Rolls(): ReactElement {
    const [selected, setSelected] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const dice = useAppSelector(settingsSelectors.selectIds);
    const position = useAppSelector(settingsSelectors.position);

    const dispatch = useAppDispatch();

    const appElement = document.getElementById('root');

    const handleRootClick = () => {
        setSelected(!selected);
        setSettingsOpen(false);
        if(!selected) {
            dispatch(rollActions.clearDice());
        }
    }

    const buttons = 
     dice.map((id) => {
        return <DieButton die={id} key={id} />;
    });
    buttons
        .unshift(
            <div className='dice-die-button' key='settings-button'
                 style={{backgroundColor:'lightgray'}}
                 onClick={e => setSettingsOpen(!settingsOpen)}>
                <span className={`dice-icon-die dice-icon-die--gear`} />
            </div>);

    if (position == Position.TopLeft || position == Position.TopRight) {
        buttons.reverse();
    }

    return (
        <div className='dice-rolling-panel'>
            <ReactModal className='settings-modal'
                        onRequestClose={e => setSettingsOpen(false)}
                        shouldCloseOnOverlayClick={true}
                        isOpen={settingsOpen}                        
                        appElement={appElement ? appElement : undefined}>
                <SettingsPanel />
            </ReactModal>
            <div className='dice-toolbar'>
                <div className={`dice-toolbar__dropdown ${selected ? 'dice-toolbar__dropdown-selected' : ''}`}>
                    <div className='dice-toolbar__dropdown-die' onClick={e => handleRootClick()}>
                        <span className='dice-icon-die dice-icon-die--d20'>
                        </span>
                    </div>
                    <div role="group" className="dice-toolbar__target"
                         hidden={dice.length == 0}
                         aria-label="roll actions">
                        <button tabIndex={0} type="button">
                            <div>
                                <p className="dice-toolbar__target-roll">Roll</p>
                            </div>
                        </button>
                    </div>
                    <div className='dice-toolbar__dropdown-top' style={{display: selected ? 'block' : 'none'}}>
                        {buttons}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Rolls;