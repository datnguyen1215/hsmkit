export default DispatchResult;
declare class DispatchResult {
    /**
     * @param {object} results
     * @param {import('./types').ActionResult[]} results.actions
     * @param {import('./types').ActionResult[]} results.entry
     * @param {import('./types').ActionResult[]} results.exit
     */
    constructor(result: any);
    /** @type {import('./types').ActionResult[]} */
    actions: import("./types").ActionResult[];
    /** @type {import('./types').ActionResult[]} */
    entry: import("./types").ActionResult[];
    /** @type {import('./types').ActionResult[]} */
    exit: import("./types").ActionResult[];
    /**
     * Wait for an action to be completed.
     * Typically used to waiting for async actions.
     * @param {string} actionName - Name of the action to be waited for.
     * @returns {Promise<any>} - Output of a single action.
     */
    wait(actionName: string): Promise<any>;
    /**
     * Wait for all actions to be completed.
     * Typically used to waiting for async actions.
     * @returns {Promise<any[]>} - Output of all actions.
     */
    waitAll(): Promise<any[]>;
}
