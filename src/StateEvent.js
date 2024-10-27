import assert from './utils/assert';
import StateNode from './StateNode';

class StateEvent {
  /**
   * @param {object} opts
   * @param {StateNode} opts.state - The state node.
   * @param {string | import('./types').EventNode | import('./types').EventNode[]} opts.config - The configuration of the event.
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

      assert(
        !node.actions || Array.isArray(node.actions),
        `node.actions must be an array: ${node.actions}`
      );

      const actions = node.actions || [];
      for (const action of actions)
        assert(
          typeof action === 'function' || state.machine.setup.actions[action],
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
   * @param {string | import('./types').EventNode | import('./types').EventNode[]} config
   * @returns {import('./types').EventNode[]}
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
   * @returns {import('./types').ExecuteResult}
   */
  execute(data) {
    for (const node of this.config) {
      // NOTE: only one condition can be true. If multiple conditions
      // are true, the first one will be executed
      const guard = this.machine.setup.guards[node.cond];

      if (
        guard &&
        !guard({ context: this.context, event: { type: this.name, data } })
      )
        continue;

      if (!node.actions) return { target: node.target };

      const results = node.actions.map(action => {
        const fn = this.machine.setup.actions[action] || action;
        return {
          state: this.state.name,
          output: fn({
            context: this.context,
            event: { type: this.name, data }
          }),
          action
        };
      });

      return { target: node.target, actions: results };
    }
  }
}

export default StateEvent;
