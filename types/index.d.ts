export * from "./types";
declare namespace _default {
    export { create };
    export { assign };
    export { StateNode };
    export { StateMachine };
    export { StateEvent };
    export { DispatchResult };
}
export default _default;
import create from './create';
import assign from './assign';
import StateNode from './StateNode';
import StateMachine from './StateMachine';
import StateEvent from './StateEvent';
import DispatchResult from './DispatchResult';
export { create, assign, StateNode, StateMachine, StateEvent, DispatchResult };
