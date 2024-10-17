export default DispatchResult;
declare class DispatchResult {
    constructor(result: any);
    actions: any;
    entry: any;
    exit: any;
    wait(actionName: string): Promise<any>;
    waitAll(): Promise<any[]>;
}
