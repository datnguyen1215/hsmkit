import StateMachine from './StateMachine';
import assign from './assign';

/**
 * @param {object} options
 * @param {hsmjs.StateConfig} options.config - The configuration of the state machine
 * @param {hsmjs.StateMachineSetup} options.setup - The setup of the state machine
 * @returns {StateMachine} - state machine instance
 */
const create = options => new StateMachine(options);

export default { create, assign };
export { create, assign };
