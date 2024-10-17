export default StateMachine;
declare class StateMachine extends Emitter<"transition" | "event"> {
    constructor({ config, setup }: {
        config: import("./types").StateConfig;
        setup: import("./types").StateMachineSetup;
    });
    private _state;
    states: {
        [x: string]: StateNode;
    };
    config: import("./types").StateConfig;
    context: object;
    setup: import("./types").StateMachineSetup;
    root: StateNode;
    get state(): StateNode;
    dispatch(eventName: string, data: any): DispatchResult;
    start(): DispatchResult;
    stop(): void;
    private validateEvents;
    private transition;
    private exit;
    private entry;
}
import { Emitter } from './utils/events';
import StateNode from './StateNode';
import DispatchResult from './DispatchResult';
