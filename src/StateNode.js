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

    this.validateEntry();
    this.validateExit();
  }

  /**
   * Validates the entry actions of the state making sure that
   * they are valid.
   * @private
   **/
  validateEntry() {
    for (const entry of this.entry) {
      assert(
        this.machine.setup.actions[entry] || typeof entry === 'function',
        `Entry action not found: ${entry}`
      );
    }
  }

  /**
   * Validates the exit actions of the state making sure that
   * they are valid.
   * @private
   **/
  validateExit() {
    for (const exit of this.exit) {
      assert(
        this.machine.setup.actions[exit] || typeof exit === 'function',
        `Exit action not found: ${exit}`
      );
    }
  }

  /**
   * @param {Object<string, StateConfig>} states
   * @returns {Object<string, State>}
   * @private
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
   * @param {Object<string, hsmjs.EventConfig>} events
   * @returns {Object<string, hsmjs.EventNode>}
   * @private
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
   * @param {hsmjs.Event} event
   * @returns {hsmjs.ExecuteResult | null}
   */
  dispatch(event) {
    assert(event, `event is required`);
    assert(event.type, `event.type is required`);

    const { type, data } = event;

    const stateEvent = this.on[type] || this.on['*'];

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
