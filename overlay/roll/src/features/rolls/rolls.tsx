import { ReactElement, useState } from 'react';
import ReactModal from 'react-modal';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { executeRoll } from '../../app/execute-roll';
import { settingsSelectors } from '../settings/settings-slice';
import SettingsPanel from '../settings/settings-panel';
import { Position } from '../settings/settings-model';
import PseudoDieButton from '../die-button/pseudo-die-button';
import DieButton from '../die-button/die-button';
import { rollActions, rollSelectors } from './rolls-slice';

function Rolls(): ReactElement {
    const [selected, setSelected] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const dice = useAppSelector(settingsSelectors.selectIds);
    const position = useAppSelector(settingsSelectors.position);
    const rollable = useAppSelector(rollSelectors.selectRollable);

    const dispatch = useAppDispatch();

    const appElement = document.getElementById('root');

    const handleRootClick = () => {
        setSelected(!selected);
        setSettingsOpen(false);
        if(!selected) {
            dispatch(rollActions.clearDice());
        }
    }

    const handleRollClick = () => {
        setSelected(!selected);
        setSettingsOpen(false);
        dispatch(executeRoll());
        //dispatch(rollActions.clearDice());
    }

    const buttons = 
        dice.map((id) => {
            return <DieButton die={id} key={id} />;
    });
    // Add Modifier button
    buttons
        .push(<PseudoDieButton
                key="mod"
                settingSelector={settingsSelectors.modifier}
                valueSelector={rollSelectors.selectModifier}
                setter={rollActions.setModifier} />);
    // Add Advantage Button
    buttons
        .push(<PseudoDieButton
                key="adv"
                settingSelector={settingsSelectors.advantage}
                valueSelector={rollSelectors.selectAdvantage}
                setter={rollActions.setAdvantage} />);
    // Add settings button
    buttons
        .unshift(
            <div className='die-button' key='settings-button'
                 style={{backgroundColor:'#c4cdd4'}}
                 onClick={e => setSettingsOpen(!settingsOpen)}>
                <span className='die-button-icon settings-icon' />
            </div>);

    if (position == Position.TopLeft || position == Position.TopRight) {
        buttons.reverse();
    }

    return (
        <div className='roll-overlay-container'>
            <ReactModal className='settings-modal'
                        style={{overlay: {
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: 'rgba(155, 155, 155, 0.5)'
                          }}}
                        onRequestClose={e => setSettingsOpen(false)}
                        shouldCloseOnOverlayClick={true}
                        isOpen={settingsOpen}
                        appElement={appElement ? appElement : undefined}>
                <SettingsPanel />
            </ReactModal>
            <div className='roll-toolbar'>
                <div className={'die-button roll-toolbar-button' + (selected ? '--selected' : '')} onClick={e => handleRootClick()} >
                    <span></span>
                </div>
                <div className={'roll-toolbar-target-group' + (rollable && selected ? ' rollable' : '') }>
                    <button onClick={e => handleRollClick()}>
                        <p>ROLL</p>
                    </button>
                </div>
                <div className={'roll-dropdown' + (selected ? '--selected' : '')}>
                    {buttons}
                </div>
            </div>
        </div>
    );
}

export default Rolls;