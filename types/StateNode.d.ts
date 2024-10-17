export default StateNode;
export type StateOptions = {
    machine: StateMachine;
    name: string;
    parent?: StateNode;
    config: import("./types").StateConfig;
};
declare class StateNode {
    constructor(opts: StateOptions);
    machine: StateMachine;
    parent: StateNode;
    name: string;
    id: string;
    initial: string;
    entry: string[] | import("./types").ActionFunction[];
    exit: string[] | import("./types").ActionFunction[];
    states: {
        [x: string]: StateNode;
    };
    on: {
        [x: string]: StateEvent;
    };
    private validateEntry;
    private validateExit;
    private parseStates;
    private parseEvents;
    dispatch(event: import("./types").DispatchEvent): import("./types").ExecuteResult | null;
    getNextState(statename: string): StateNode;
}
import StateMachine from './StateMachine';
import StateEvent from './StateEvent';
