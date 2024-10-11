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

    /** @type {StateMachine} */
    this.machine = machine;
    /** @type {StateNode} */
    this.parent = parent;
    /** @type {string} */
    this.name = parent ? `${parent.name}.${name}` : name;

    /** @type {string} */
    this.id = config.id
      ? config.id
      : parent?.id
        ? `${parent.id}.${name}`
        : null;

    /** @type {string} */
    this.initial = config.initial;
    /** @type {string[]} */
    this.entry = config.entry || [];
    /** @type {string[]} */
    this.exit = config.exit || [];

    this.machine.states[this.name] = this;
    if (this.id) this.machine.states[this.id] = this;

    /** @type {Object<string, StateNode>} */
    this.states = this.parseStates(config.states || {});
    /** @type {Object<string, StateEvent>} */
    this.on = this.parseEvents(config.on || {});
  }

  /**
   * @param {Object<string, StateConfig>} states
   * @returns {Object<string, State>}
   */
  parseStates(states) {
    return Object.entries(states).reduce((acc, [key, value]) => {
      acc[key] = new StateNode({
        machine: this.machine,
        name: key,
        parent: this,
        config: value
      });

      return acc;
    }, {});
  }

  /**
   * @param {Object<string, hsm.EventConfig>} events
   * @returns {Object<string, hsm.EventNode>}
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

  /**
   * Dispatch an event to the state. If the state doesn't handle the event,
   * it'll be dispatched to the parent state.
   * @param {hsm.Event} event
   * @returns {hsm.ExecuteResult | null}
   */
  dispatch(event) {
    assert(event, `event is required`);
    assert(event.type, `event.type is required`);

    const { type, data } = event;

    const stateEvent = this.on[type];

    if (!stateEvent) {
      if (!this.parent) return null;

      return this.parent.dispatch(event);
    }

    return stateEvent.execute(data);
  }

  /**
   * @param {string} statename - The name of the state
   * @returns {StateNode}
   */
  getNextState(statename) {
    const next =
      this.parent?.states[statename] ||
      this.machine.states[statename] ||
      this.states[statename];

    return next;
  }
}

export default StateNode;
