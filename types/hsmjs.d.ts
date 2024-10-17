export function create(options: {
    config: import("./types").StateConfig;
    setup: import("./types").StateMachineSetup;
}): StateMachine;
import assign from './assign';
import StateMachine from './StateMachine';
export { assign };
