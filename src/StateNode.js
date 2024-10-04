import Action from './Action';
import StateEvent from './StateEvent';

class StateNode {
  /**
   * @param {object} options
   * @param {StateMachine} options.machine
   * @param {string} options.name
   * @param {StateNodeConfig} options.config
   * @param {StateNode} options.parent
   * */
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

  dispatch(event, data = {}, bubbles = []) {
    const ev = this.on[event];

    // bubble event if necessary
    if (!ev) {
      if (!this.parent) return {};

      console.log(`${this.name} bubbling event: ${event}`);
      const results = this.parent.dispatch(event, data, [this, ...bubbles]);

      this.always();

      return results;
    }

    console.log(`${this.name} dispatching event: ${event}`);
    const results = { bubbles, ...ev.execute(this.machine.context, data) };

    this.always();

    return results;
  }

  entry() {
    console.log(`entry: ${this.name}`);
    return this.entryActions.map(x => ({
      [x.name]: x.execute(this.machine.context, {})
    }));
  }

  exit() {
    console.log(`exit: ${this.name}`);
    return this.exitActions.map(x => ({
      [x.name]: x.execute(this.machine.context, {})
    }));
  }

  always() {
    if (!this.alwaysEvent) return {};

    return this.alwaysEvent.execute(this.machine.context, {});
  }
}

export default StateNode;
