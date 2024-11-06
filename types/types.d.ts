import StateMachine from './StateMachine';
import StateNode from './StateNode';
export type StateConfig<TContext = object> = {
    initial: string;
    id: string;
    context: TContext;
    states: {
        [key: string]: StateConfig<TContext>;
    };
    on: {
        [key: string]: string | EventNode | EventNode[];
    };
    entry: string[];
    exit: string[];
};
export type DispatchEvent = {
    type: string;
    data?: object;
};
export type ActionOptions<TContext = object, TEvent = DispatchEvent, TMachine = StateMachine> = {
    machine: TMachine;
    context: TContext;
    event: TEvent;
};
export type ActionFunction = (options: ActionOptions) => any | Promise<any>;
export type StateMachineSetup = {
    actions?: {
        [key: string]: ActionFunction;
    };
    guards?: {
        [key: string]: (options: ActionOptions) => boolean;
    };
};
export type EventConfig = {
    config: string | EventNode | EventNode[];
};
export type EventNode = {
    target?: string;
    actions?: string[] | ActionFunction[];
    cond?: string;
};
export type ExecuteResult = {
    target?: StateNode;
    actions?: ActionResult[];
};
export type ActionResult = {
    state: string;
    action: string;
    output?: any;
};
