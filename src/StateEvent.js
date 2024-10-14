import assert from './utils/assert';
import StateNode from './StateNode';

class StateEvent {
  /**
   * @param {object} opts
   * @param {StateNode} opts.state - The state node.
   * @param {string | hsmjs.EventNode | hsmjs.EventNode[]} opts.config - The configuration of the event.
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

    for (const node of this.config) {
      assert(
        !node.target || typeof node.target === 'string',
        `node.target must be a string: ${node.target}`
      );

      const actions = node.actions || [];
      for (const action of actions)
        assert(
          state.machine.setup.actions[action] || typeof action === 'function',
          `Invalid action: ${action}`
        );

      const cond = node.cond;
      assert(
        !cond || (typeof cond === 'string' && state.machine.setup.guards[cond]),
        `Invalid guard: ${cond}`
      );
    }
  }

  get context() {
    return this.machine.context;
  }

  get machine() {
    return this.state.machine;
  }

  /**
   * @param {string | hsmjs.EventNode | hsmjs.EventNode[]} config
   * @returns {hsmjs.EventNode[]}
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
   * @returns {hsmjs.ExecuteResult}
   */
  execute(data) {
    for (const node of this.config) {
      // NOTE: only one condition can be true. If multiple conditions
      // are true, the first one will be executed
      const guard = this.machine.setup.guards[node.cond];

      if (guard && !guard()) continue;

      if (!node.actions) return { target: node.target };

      const results = node.actions.map(action => {
        const fn = this.machine.setup.actions[action] || action;
        return {
          state: this.state.name,
          output: fn(this.context, { type: this.name, data }),
          action
        };
      });

      return { target: node.target, actions: results };
    }
  }
}

export default StateEvent;
