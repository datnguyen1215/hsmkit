/**
 * @param {object} options
 * @param {import('./types').StateConfig} options.config - The configuration of the state machine
 * @param {import('./types').StateMachineSetup} options.setup - The setup of the state machine
 * @returns {StateMachine} - state machine instance
 */
export function create(options: {
    config: import("./types").StateConfig;
    setup: import("./types").StateMachineSetup;
}): StateMachine;
import assign from './assign';
import StateMachine from './StateMachine';
export { assign };
