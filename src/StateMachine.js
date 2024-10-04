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
  }

  dispatch(event, data = {}) {
    const result = this.state.dispatch(event, data);
    console.log(result);

    if (!result.target) return;

    let state = this.states[result.target];

    while (result.bubbles.length) {
      const bubbleState = result.bubbles.pop();

      // TODO: Save the results?
      bubbleState.exit();

      state = this.state.parent;
    }

    console.log(state, this.state);

    state = (state || this.state).parent.states[result.target];

    this.transition(state);
  }

  transition(state) {
    console.log(`transitioning to state: ${state.name}`);
  }

  start() {
    this.state = this.root;
    this.state.entry();

    while (this.state.initial) {
      const next = this.state.states[this.state.initial];
      console.log('initial:', this.state.initial);

      if (!next) return;

      console.log('switching to state:', next.name);
      this.state = next;
      this.state.entry();
    }
  }

  stop() {}
}

export default StateMachine;
