export default create;
/**
 * @param {object} options
 * @param {import('./types').StateConfig} options.config - The configuration of the state machine
 * @param {import('./types').StateMachineSetup} options.setup - The setup of the state machine
 * @returns {StateMachine} - state machine instance
 */
declare function create(options: {
    config: import("./types").StateConfig;
    setup: import("./types").StateMachineSetup;
}): StateMachine;
import StateMachine from './StateMachine';
