export default DispatchResult;
declare class DispatchResult {
    constructor(result: any);
    actions: import("./types").ActionResult[];
    entry: import("./types").ActionResult[];
    exit: import("./types").ActionResult[];
    wait(actionName: string): Promise<any>;
    waitAll(): Promise<any[]>;
}
