/**
 * @typedef {object} StateOptions
 * @property {StateMachine} opts.machine - The parent state machine
 * @property {string} opts.name - The name of the state
 * @property {StateNode} opts.parent - The parent state
 * @property {StateConfig} opts.config - The configuration of the state
 */

import assert from './utils/assert';
import StateEvent from './StateEvent';

class StateNode {
  /**
   * @param {StateOptions} opts
   */
  constructor(opts) {
    assert(opts, 'opts is required');

    const { machine, name, parent, config } = opts;
    assert(machine, 'machine is required');

    this.machine = machine;
    this.parent = parent;
    this.name = name;
    this.id = config.id;
    this.initial = config.initial;
    this.states = this.parseStates(config.states || {});
    this.on = this.parseEvents(config.on || {});
    this.entry = config.entry || [];
    this.exit = config.exit || [];
  }

  /**
   * @param {Object<string, StateConfig>} states
   * @returns {object<string, State>}
   */
  parseStates(states) {
    return Object.entries(states).reduce((acc, [key, value]) => {
      acc[key] = new StateNode({
        machine: this.machine,
        name: key,
        parent: this,
        config: value
      });

      if (this.id) this.machine.states[this.id] = acc[key];
      this.machine.states[this.name] = acc[key];

      return acc;
    }, {});
  }

  /**
   * @param {Object<string, EventConfig>} events
   * @returns {object<string, EventConfig>}
   */
  parseEvents(events) {
    return Object.entries(events).reduce((acc, [key, value]) => {
      acc[key] = new StateEvent({
        state: this,
        name: key,
        config: value
      });

      return acc;
    }, {});
  }

  // dispatch(event) {
  //   return this.machine.dispatch(eventName, data);
  // }
}

export default StateNode;
