/**
 * @typedef {object} StateOptions
 * @property {StateMachine} opts.machine - The parent state machine
 * @property {string} opts.name - The name of the state
 * @property {State} opts.parent - The parent state
 * @property {StateConfig} opts.config - The configuration of the state
 */

import assert from './utils/assert';

class State {
  /**
   * @param {StateOptions} opts
   */
  constructor(opts) {
    assert(opts, 'opts is required');

    const { machine, name, parent, config } = opts;
    this.machine = machine;
    this.config = config;
    this.parent = parent;
    this.name = config.id || parent ? `${parent.name}.${name}` : name;

    // this state can be referenced by its id or name
    this.machine[config.id] = this;
    this.machine[this.name] = this;

    assert(this.machine, 'machine is required');
    assert(this.name, 'name is required');
    assert(this.config, 'config is required');
  }

  dispatch(event) {
    return this.machine.dispatch(eventName, data);
  }
}

export default State;
