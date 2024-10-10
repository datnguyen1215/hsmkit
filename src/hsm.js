import StateMachine from './StateMachine';

/**
 * @param {object} options
 * @param {StateConfig} options.config - The configuration of the state machine
 * @param {StateMachineSetup} options.setup - The setup of the state machine
 * @returns {StateMachine} - state machine instance
 */
const create = options => new StateMachine(options);

export default { create };
