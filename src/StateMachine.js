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

    // go through all the events and check the target now
    const referenceTarget = state => {
      const events = Object.keys(state.on);

      // go through all the events of this state.
      for (let event of events) {
        console.log(`checking event: ${event}`);
        // go through all the event nodes of this event.
        for (let node of state.on[event].nodes) {
          if (!node.target) continue;

          // check the target against the states, in case of #id assigns
          let target = this.states[node.target];

          if (target) {
            console.log(`assigning target ${node.target} to ${target.name}`);
            node.target = target;
            continue;
          }

          // check the target gainst the parent states

          target =
            state.states[node.target] || state.parent.states[node.target];

          if (!target)
            throw new Error(`target ${node.target} not found in ${state.name}`);

          console.log(`assigning target ${node.target} to ${target.name}`);
          node.target = target;
        }
      }

      // go through all the states inside.
      for (let s in state.states) referenceTarget(state.states[s]);
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
