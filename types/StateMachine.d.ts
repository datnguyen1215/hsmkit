export default StateMachine;
export type BaseEvent = "transition" | "event";
/**
 * @template {object} [TContext=never]
 * @template {string} [TEvent=never]
 * @class
 * @extends {Emitter<BaseEvent | TEvent>}
 */
declare class StateMachine<TContext extends unknown = never, TEvent extends string = never> extends Emitter<TEvent | BaseEvent> {
    /**
     * State machine instance.
     * @param {object} opts
     * @param {import('./types').StateConfig} opts.config - The configuration of the state machine
     * @param {import('./types').StateMachineSetup} opts.setup - The setup of the state machine
     */
    constructor({ config, setup }: {
        config: import("./types").StateConfig;
        setup: import("./types").StateMachineSetup;
    });
    /**
     * @private
     * @type {StateNode}
     **/
    private _state;
    /**
     * @type {Object<string, StateNode>}
     **/
    states: {
        [x: string]: StateNode;
    };
    /**
     * @type {import('./types').StateConfig}
     **/
    config: import("./types").StateConfig;
    /** @type {object | TContext} **/
    context: object | TContext;
    /**
     * @type {import('./types').StateMachineSetup}
     **/
    setup: import("./types").StateMachineSetup;
    /**
     * @type {StateNode}
     **/
    root: StateNode;
    /**
     * @type {StateNode}
     **/
    get state(): StateNode;
    /**
     * Dispatch an event to the state machine.
     * @param {string} eventName - Name of the event to be triggered.
     * @param {any} data - Data to be passed into actions/guards.
     * @return {DispatchResult} Result of the dispatch.
     */
    dispatch(eventName: string, data: any): DispatchResult;
    /**
     * Starting the state machine.
     * @return {DispatchResult} Result of the dispatch (usually entry/exit).
     **/
    start(): DispatchResult;
    /**
     * Stopping the state machine.
     * @return {void}
     **/
    stop(): void;
    /**
     * Check if the current state matches the given state path.
     * @param {string} statePath - The state path to match against
     * @returns {boolean} True if the current state matches the path
     */
    matches(statePath: string): boolean;
    /**
     * @private
     * Validates the events of the state machine making sure that
     * the target states are valid.
     **/
    private validateEvents;
    /**
     * @private
     * @param {StateNode} next - The name of the state
     * @param {import('./types').DispatchEvent} event - The event object
     * @returns {{ entry: import('./types').ActionResult[], exit: import('./types').ActionResult[] }}
     */
    private transition;
    /**
     * @private
     * @param {StateNode} state - The state node
     * @param {import('./types').DispatchEvent} event - The event object
     * @returns {import('./types').ActionResult[]}
     */
    private exit;
    /**
     * @private
     * @param {StateNode} state - The state node
     * @param {import('./types').DispatchEvent} event - The event object
     * @returns {import('./types').ActionResult[]}
     */
    private entry;
}
import { Emitter } from './utils/events';
import StateNode from './StateNode';
import DispatchResult from './DispatchResult';
