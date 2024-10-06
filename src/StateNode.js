import Action from './Action';
import StateEvent from './StateEvent';

class StateNode {
  /**
   * Represents a state node within a state machine.
   * @param {object} options - Options for initializing the state node.
   * @param {StateMachine} options.machine - The state machine this node belongs to.
   * @param {string} options.name - The name of this state node.
   * @param {object} options.config - Configuration object for this state node.
   * @param {string} options.config.id - Unique identifier for this state node.
   * @param {string} options.config.initial - Initial state name.
   * @param {object} options.config.states - Child states configuration.
   * @param {string[]} [options.config.entry] - List of entry action names.
   * @param {string[]} [options.config.exit] - List of exit action names.
   * @param {object} [options.config.always] - Always transition configuration.
   * @param {object} [options.config.on] - Event transition configurations.
   * @param {StateNode} options.parent - The parent state node.
   */
  constructor({ machine, name, config, parent }) {
    console.log(`creating state node: ${name}`);
    this.config = config;
    this.parent = parent;
    this.machine = machine;
    this.id = config.id;
    this.initial = config.initial;
    this.name = name;

    this.states = Object.keys(config.states || {}).reduce((acc, x) => {
      acc[x] = new StateNode({
        machine,
        name: `${name}.${x}`,
        config: config.states[x],
        parent: this
      });
      return acc;
    }, {});

    this.entryActions = (config.entry || []).map(
      x => new Action({ machine, name: x })
    );

    this.exitActions = (config.exit || []).map(
      x => new Action({ machine, name: x })
    );

    this.alwaysEvent = !config.always
      ? null
      : new StateEvent({
          machine,
          state: this,
          config: config.always || {},
          name: `${name}.always`
        });

    this.on = Object.keys(config.on || {}).reduce((acc, x) => {
      acc[x] = new StateEvent({
        machine,
        state: this,
        config: config.on[x],
        name: `${name}.${x}`
      });
      return acc;
    }, {});
  }

  /**
   * Dispatches an event to the state node.
   * @param {string} event - The event name to dispatch.
   * @param {object} [data={}] - Optional data to pass with the event.
   * @param {Array} [bubbles=[]] - Tracks the event bubbling history.
   * @returns {object} Results of the dispatched event.
   */
  dispatch(event, data = {}, bubbles = []) {
    const ev = this.on[event];

    // bubble event if necessary
    if (!ev) {
      if (!this.parent) return {};

      console.log(`${this.name} bubbling event: ${event}`);
      const results = this.parent.dispatch(event, data, [this, ...bubbles]);

      this.always(this.machine.context, { type: event, data });

      return results;
    }

    console.log(`${this.name} dispatching event: ${event}`);
    const results = {
      bubbles,
      ...ev.execute(this.machine.context, { type: event, data })
    };

    this.always(this.machine.context, { type: event, data });

    return results;
  }

  /**
   * Executes entry actions for the state node.
   * @returns {Array} Results of the entry actions.
   */
  entry() {
    console.log(`entry: ${this.name}`);
    return this.entryActions.map(x => ({
      [x.name]: x.execute(this.machine.context, {})
    }));
  }

  /**
   * Executes exit actions for the state node.
   * @returns {Array} Results of the exit actions.
   */
  exit() {
    console.log(`exit: ${this.name}`);
    return this.exitActions.map(x => ({
      [x.name]: x.execute(this.machine.context, {})
    }));
  }

  /**
   * Executes the 'always' event for the state node if configured.
   * @returns {object} Result of the 'always' event execution.
   */
  always() {
    if (!this.alwaysEvent) return {};

    return this.alwaysEvent.execute(this.machine.context, {});
  }
}

export default StateNode;