import StateMachine from './StateMachine';

/**
 * @param {object} options
 * @param {import('./types').StateConfig} options.config - The configuration of the state machine
 * @param {import('./types').StateMachineSetup} options.setup - The setup of the state machine
 * @returns {StateMachine} - state machine instance
 */
const create = options => new StateMachine(options);

export default create;
