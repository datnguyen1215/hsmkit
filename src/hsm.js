import StateMachine from './StateMachine';
import assign from './assign';

/**
 * @param {object} options
 * @param {hsm.StateConfig} options.config - The configuration of the state machine
 * @param {hsm.StateMachineSetup} options.setup - The setup of the state machine
 * @returns {StateMachine} - state machine instance
 */
const create = options => new StateMachine(options);

export default { create, StateMachine, assign };
export { create, StateMachine, assign };
