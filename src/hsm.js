import StateMachine from './StateMachine';

/**
 * @param {object} options
 * @param {hsm.StateConfig} options.config - The configuration of the state machine
 * @param {hsm.StateMachineSetup} options.setup - The setup of the state machine
 * @returns {StateMachine} - state machine instance
 */
const create = options => new StateMachine(options);

export default { create, StateMachine };
export { create, StateMachine };
