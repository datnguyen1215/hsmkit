import StateNode from './StateNode';
import assert from './utils/assert';
import merge from './utils/merge';
import flatten from './utils/flatten';
import events from './utils/events';

const DEFAULT_SETUP = { actions: {}, guards: {} };

/**
 * @class
 * @extends events.Emitter<'transition' | 'event'>
 */
class StateMachine extends events.Emitter {
  /**
   * @param {object} opts
   * @param {hsm.StateConfig} opts.config - The configuration of the state machine
   * @param {hsm.StateMachineSetup} opts.setup - The setup of the state machine
   */
  constructor({ config, setup }) {
    super();

    setup = merge({}, { actions: {}, guards: {} }, setup);

    assert(config, 'config is required');

    /**
     * @type {StateNode}
     * @private
     **/
    this._state = null;

    /**
     * @type {Object<string, StateNode>}
     * @private
     **/
    this.states = {};

    /** @type {hsm.StateConfig} */
    this.config = config;

    this.context = this.config.context || {};

    /** @type {hsm.StateMachineSetup} */
    this.setup = merge({}, DEFAULT_SETUP, setup);

    /** @type {StateNode} */
    this.root = new StateNode({
      machine: this,
      name: '(root)',
      config
    });

    this.validateEvents();
  }

  /** @type {StateNode} */
  get state() {
    if (!this._state) throw new Error('machine is not started.');
    return this._state;
  }

  /**
   * Dispatch an event to the state machine.
   * @param {string} eventName - The name of the event
   * @param {any} data - The data of the event
   * @return {hsm.DispatchResult}
   */
  dispatch(eventName, data) {
    assert(this._state, 'machine is not started.');

    const event = { type: eventName, data };

    this.emit('event', event);

    const result = this._state.dispatch(event);

    if (!result) return { actions: [], entry: [], exit: [] };

    const { actions = [], target } = result;

    if (!target) return { actions };

    const { entry, exit } = this.transition(target, event);
    return { actions, entry, exit };
  }

  /**
   * Starting the state machine.
   * @return {hsm.DispatchResult}
   **/
  start() {
    return this.transition(this.root.name, { type: '(machine).start' });
  }

  /**
   * Stopping the state machine.
   * @return {void}
   **/
  stop() {
    this._state = null;
  }

  /**
   * Validates the events of the state machine making sure that
   * the target states are valid.
   * @private
   **/
  validateEvents() {
    for (const state of Object.values(this.states)) {
      for (const event of Object.values(state.on)) {
        for (const config of event.config) {
          if (!config.target) return;
          assert(
            state.getNextState(config.target),
            `Invalid target: ${config.target}`
          );
        }
      }
    }
  }

  /**
   * @param {string} stateName - The name of the state
   * @param {hsm.Event} event - The event object
   * @returns {{ entry: hsm.ActionResult[], exit: hsm.ActionResult[] }}
   * @private
   */
  transition(stateName, event) {
    assert(stateName, 'stateName is required');

    const next = this._state?.getNextState(stateName) || this.states[stateName];
    assert(next, `state not found: ${stateName}`);

    if (next.initial) {
      const prev = this._state;
      this._state = next;
      this.emit('transition', next, prev);
      return this.transition(next.initial, event);
    }

    /**
     * @param {StateNode} state - The state node
     * @returns {StateNode[]}
     * @private
     **/
    const ancestors = state => {
      if (!state) return [];

      const results = [];
      while (state.parent) {
        results.push(state.parent);
        state = state.parent;
      }
      return results;
    };

    /**
     * @param {StateNode[]} curAncestors - The current ancestors
     * @param {StateNode[]} nextAncestors - The next ancestors
     * @returns {{ entry: StateNode[], exit: StateNode[] }}
     * @private
     **/
    const getEntryExit = (curAncestors, nextAncestors) => {
      const entry = [];
      for (const next of nextAncestors) {
        const exit = [];

        entry.push(next);

        for (const cur of curAncestors) {
          exit.push(cur);
          if (next === cur) return { entry, exit };
        }
      }

      return { entry: [], exit: [] };
    };

    const currentAncestors = ancestors(this._state);
    const nextAncestors = ancestors(next);

    const { entry, exit } = getEntryExit(
      this._state ? [this._state, ...currentAncestors] : currentAncestors,
      [next, ...nextAncestors]
    );

    const exitResults = flatten(exit.map(x => this.exit(x, event)));
    const entryResults = flatten(entry.map(x => this.entry(x, event)));

    const prev = this._state;
    this._state = next;
    this.emit('transition', next, prev);

    return { entry: entryResults, exit: exitResults };
  }

  /**
   * @param {StateNode} state - The state node
   * @param {hsm.Event} event - The event object
   * @returns {hsm.ActionResult[]}
   * @private
   */
  exit(state, event) {
    const actions = state.exit.map(action => {
      const fn = this.setup.actions[action] || action;
      return {
        state: this._state.name,
        action,
        output: fn(this.context, event)
      };
    });

    return actions;
  }

  /**
   * @param {StateNode} state - The state node
   * @param {hsm.Event} event - The event object
   * @returns {hsm.ActionResult[]}
   * @private
   */
  entry(state, event) {
    const actions = state.entry.map(action => {
      const fn = this.setup.actions[action] || action;
      return {
        state: this._state.name,
        action,
        output: fn(this.context, event)
      };
    });

    return actions;
  }
}

export default StateMachine;
