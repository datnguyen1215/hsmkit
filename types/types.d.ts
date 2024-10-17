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
export type ActionFunction = (context: object, event: DispatchEvent) => any | Promise<any>;
export type StateMachineSetup = {
    actions?: {
        [key: string]: ActionFunction;
    };
    guards?: {
        [key: string]: (arg0: any, arg1: DispatchEvent) => boolean;
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
