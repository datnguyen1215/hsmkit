export default StateEvent;
declare class StateEvent {
    /**
     * @param {object} opts
     * @param {StateNode} opts.state - The state node.
     * @param {string | import('./types').EventNode | import('./types').EventNode[]} opts.config - The configuration of the event.
     * @param {string} opts.name - The name of the event.
     */
    constructor({ state, config, name }: {
        state: StateNode;
        config: string | import("./types").EventNode | import("./types").EventNode[];
        name: string;
    });
    name: string;
    state: StateNode;
    config: import("./types").EventNode[];
    get context(): any;
    get machine(): import("./StateMachine").default<never, never>;
    /**
     * @param {string | import('./types').EventNode | import('./types').EventNode[]} config
     * @returns {import('./types').EventNode[]}
     */
    normalizeConfig(config: string | import("./types").EventNode | import("./types").EventNode[]): import("./types").EventNode[];
    /**
     * Execute the event.
     * @param {object} data
     * @returns {import('./types').ExecuteResult}
     */
    execute(data: object): import("./types").ExecuteResult;
}
import StateNode from './StateNode';
