import StateMachine from './StateMachine';
export type StateConfig = {
    initial: string;
    id: string;
    context: object;
    states: {
        [key: string]: StateConfig;
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
export type ActionOptions<TContext = object> = {
    machine: StateMachine;
    context: TContext;
    event: DispatchEvent;
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
    target?: string;
    actions?: ActionResult[];
};
export type ActionResult = {
    state: string;
    action: string;
    output?: any;
};
