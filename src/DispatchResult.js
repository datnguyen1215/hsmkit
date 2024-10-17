class DispatchResult {
  /**
   * @param {object} results
   * @param {import('./types').ActionResult[]} results.actions
   * @param {import('./types').ActionResult[]} results.entry
   * @param {import('./types').ActionResult[]} results.exit
   */
  constructor(result) {
    /** @type {import('./types').ActionResult[]} */
    this.actions = result.actions || [];
    /** @type {import('./types').ActionResult[]} */
    this.entry = result.entry || [];
    /** @type {import('./types').ActionResult[]} */
    this.exit = result.exit || [];
  }

  /**
   * Wait for an action to be completed.
   * Typically used to waiting for async actions.
   * @param {string} actionName
   * @returns {Promise<any>}
   */
  async wait(actionName) {
    const actions = [...this.actions, ...this.entry, ...this.exit];
    const action = actions.find(a => a.action === actionName);

    if (!action) return;

    return action.output;
  }

  /**
   * Wait for all actions to be completed.
   * Typically used to waiting for async actions.
   * @returns {Promise<any[]>}
   */
  async waitAll() {
    const actions = [...this.actions, ...this.entry, ...this.exit];
    return Promise.all(actions.map(a => a.output));
  }
}

export default DispatchResult;
