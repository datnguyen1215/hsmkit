/**
 * @typedef {object} StateOptions
 * @property {StateMachine} opts.machine - The parent state machine
 * @property {string} opts.name - The name of the state
 * @property {StateNode} [opts.parent] - The parent state
 * @property {import('./types').StateConfig} opts.config - The configuration of the state
 */

import assert from './utils/assert';
import StateEvent from './StateEvent';
import StateMachine from './StateMachine';

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
    /** @type {string[] | import('./types').ActionFunction[]} */
    this.entry = config.entry || [];
    /** @type {string[] | import('./types').ActionFunction[]} */
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
   * Check if the state matches the provided state value path
   * @param {string} stateValue - State value to check
   * @returns {boolean}
   */
  matches(stateValue) {
    if (!stateValue) return false;

    // Handle exact matches first
    if (this.name === stateValue || this.id === stateValue) return true;

    // Split both the current state path and target state value into segments
    const targetSegments = stateValue.split('.');
    const currentSegments = this.name.split('.');

    // The target path should not be longer than the current state path
    if (targetSegments.length > currentSegments.length) return false;

    // Check if all segments match from right to left
    for (let i = 0; i < targetSegments.length; i++) {
      if (
        targetSegments[i] !==
        currentSegments[currentSegments.length - targetSegments.length + i]
      )
        return false;
    }

    return true;
  }

  /**
   * Validates the entry actions of the state making sure that
   * they are valid.
   * @private
   **/
  validateEntry() {
    for (const entry of this.entry) {
      assert(
        typeof entry === 'function' || this.machine.setup.actions[entry],
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
        typeof exit === 'function' || this.machine.setup.actions[exit],
        `Exit action not found: ${exit}`
      );
    }
  }

  /**
   * @param {Object<string, import('./types').StateConfig>} states
   * @returns {Object<string, StateNode>}
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
   * @param {Object<string, string | import('./types').EventNode | import('./types').EventNode[]>} events
   * @returns {Object<string, StateEvent>}
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
   * @param {import('./types').DispatchEvent} event
   * @returns {import('./types').ExecuteResult | null}
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
