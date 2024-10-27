export default StateNode;
export type StateOptions = {
    /**
     * - The parent state machine
     */
    machine: StateMachine;
    /**
     * - The name of the state
     */
    name: string;
    /**
     * - The parent state
     */
    parent?: StateNode;
    /**
     * - The configuration of the state
     */
    config: import("./types").StateConfig;
};
declare class StateNode {
    /**
     * @param {StateOptions} opts
     */
    constructor(opts: StateOptions);
    /** @type {StateMachine} */
    machine: StateMachine;
    /** @type {StateNode} */
    parent: StateNode;
    /** @type {string} */
    name: string;
    /** @type {string} */
    id: string;
    /** @type {string} */
    initial: string;
    /** @type {string[] | import('./types').ActionFunction[]} */
    entry: string[] | import("./types").ActionFunction[];
    /** @type {string[] | import('./types').ActionFunction[]} */
    exit: string[] | import("./types").ActionFunction[];
    /** @type {Object<string, StateNode>} */
    states: {
        [x: string]: StateNode;
    };
    /** @type {Object<string, StateEvent>} */
    on: {
        [x: string]: StateEvent;
    };
    /**
     * Validates the entry actions of the state making sure that
     * they are valid.
     * @private
     **/
    private validateEntry;
    /**
     * Validates the exit actions of the state making sure that
     * they are valid.
     * @private
     **/
    private validateExit;
    /**
     * @param {Object<string, import('./types').StateConfig>} states
     * @returns {Object<string, StateNode>}
     * @private
     */
    private parseStates;
    /**
     * @param {Object<string, string | import('./types').EventNode | import('./types').EventNode[]>} events
     * @returns {Object<string, StateEvent>}
     * @private
     */
    private parseEvents;
    /**
     * Dispatch an event to the state. If the state doesn't handle the event,
     * it'll be dispatched to the parent state.
     * @param {import('./types').DispatchEvent} event
     * @returns {import('./types').ExecuteResult | null}
     */
    dispatch(event: import("./types").DispatchEvent): import("./types").ExecuteResult | null;
    /**
     * @param {string} statename - The name of the state
     * @returns {StateNode}
     */
    getNextState(statename: string): StateNode;
}
import StateMachine from './StateMachine';
import StateEvent from './StateEvent';
