import StateNode from './StateNode';

class StateMachine {
  /**
   * @param {StateNodeConfig} config
   * @param {Setup} setup
   */
  constructor(config, setup) {
    this.config = config;
    this.context = config.context;
    this.setup = setup;
    this.states = {};
    this.setup = setup;

    this.state = null;

    this.root = new StateNode({
      config,
      name: config.id || 'root',
      machine: this
    });

    this.states[this.root.name] = this.root;

    const findTarget = (targetName, state) => {
      if (state.states[targetName]) return state.states[targetName];
      if (state.parent && state.parent.states[targetName])
        return state.parent.states[targetName];
      return null;
    };

    const resolveTarget = (node, state) => {
      if (!node.target) return;

      const target = this.states[node.target] || findTarget(node.target, state);

      if (!target) {
        throw new Error(`Target ${node.target} not found in ${state.name}`);
      }

      console.log(`Assigning target ${node.target} to ${target.name}`);
      node.target = target;
    };

    const resolveEventTargets = state => {
      Object.entries(state.on).forEach(([event, { nodes }]) => {
        console.log(`Checking event: ${event}`);
        nodes.forEach(node => resolveTarget(node, state));
      });
    };

    const referenceTarget = state => {
      resolveEventTargets(state);
      Object.values(state.states).forEach(referenceTarget);
    };

    referenceTarget(this.root);
  }

  dispatch(event, data = {}) {
    const result = this.state.dispatch(event, data);

    if (!result.target) return;

    if (!result.bubbles.length) this.state.exit();

    while (result.bubbles.length) {
      const bubbleState = result.bubbles.pop();
      // TODO: Save results to handle actions results.
      bubbleState.exit();
    }

    this.transition(result.target);
  }

  transition(state) {
    this.state = state;
    this.state.entry();

    while (this.state.initial) {
      const next = this.state.states[this.state.initial];

      if (!next) return;

      this.state = next;
      this.state.entry();
    }
  }

  start() {
    this.transition(this.root);
  }

  stop() {
    // TODO: Dispose all the states/events/nodes
  }
}

export default StateMachine;
