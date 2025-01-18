import { useAppSelector } from "../../app/hooks";
import { settingsSelectors } from "./settings-slice";
import DieConfigRow from "./die-confg-row";
import NewDieRow from "./new-die-row";

function DieConfigTable() {
    const dice = useAppSelector(settingsSelectors.selectAll);

    const diceProps = dice.map(d => {
        return <DieConfigRow key={d.id} die={d.id} />
    });
    return (
        <div>
            <h3>Available Dice</h3>
            <table>
                <thead>
                    <tr>
                        <th>Id</th><th>Label</th><th>Sides</th><th>Count</th><th>Icon</th><th>Args</th>
                    </tr>
                </thead>
                <tbody>
                    {diceProps}
                    <NewDieRow />
                </tbody>
            </table>
        </div>
    )
}

export default DieConfigTable;