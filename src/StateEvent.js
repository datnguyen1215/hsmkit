/**
 * @typedef {object} EventNode
 * @property {string} target - The target state
 * @property {string[]} actions - The actions to execute
 * @property {string} cond - The condition
 */

import assert from './utils/assert';

class StateEvent {
  /**
   * @param {object} opts
   * @param {StateNode} opts.state - The state node.
   * @param {string | EventNode | EventNode[]} opts.config - The configuration of the event.
   * @param {string} opts.name - The name of the event.
   */
  constructor({ state, config, name }) {
    assert(state, 'state is required');
    assert(config, 'config is required');
    assert(name, 'name is required');

    this.name = name;
    this.state = state;

    // normalize config
    this.config = this.normalizeConfig(config);
  }

  get context() {
    return this.machine.context;
  }

  get machine() {
    return this.state.machine;
  }

  /**
   * @param {string | EventNode | EventNode[]} config
   * @returns {EventNode[]}
   */
  normalizeConfig(config) {
    switch (typeof config) {
      case 'string':
        return [{ target: config }];
      case 'object':
        if (Array.isArray(config)) return config;

        return [config];
      default:
        throw new Error(`Invalid config for event: ${this.name}`);
    }
  }

  /**
   * Execute the event.
   * @param {object} data
   * @returns {any[]}
   */
  execute(data) {
    for (const node of this.config) {
      // NOTE: only one condition can be true. If multiple conditions
      // are true, the first one will be executed
      const guard = this.machine.setup.guards[node.cond];

      if (!guard()) continue;

      const results = node.actions.map(action => {
        const fn = this.machine.setup.actions[action];
        return {
          output: fn(this.context, { type: this.name, data }),
          name: action
        };
      });

      return { target: node.target, actions: results };
    }
  }
}

export default StateEvent;
