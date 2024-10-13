import StateNode from './StateNode';
import assert from './utils/assert';
import merge from './utils/merge';
import flatten from './utils/flatten';
import events from './utils/events';

const DEFAULT_SETUP = { actions: {}, guards: {} };

/**
 * @preseve
 * @class StateMachine
 * @extends events.Emitter<'transition' | 'event'>
 */
class StateMachine extends events.Emitter {
  /**
   * @preserve
   * @param {object} opts
   * @param {hsm.StateConfig} opts.config - The configuration of the state machine
   * @param {hsm.StateMachineSetup} opts.setup - The setup of the state machine
   */
  constructor({ config, setup }) {
    super();

    setup = merge({}, { actions: {}, guards: {} }, setup);

    assert(config, 'config is required');

    /** @type {StateNode} */
    this.state = null;

    /**
     * @private
     * @type {Object<string, StateNode>}
     * Used to store the state nodes of the state machine.
     * */
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

  /**
   * @preserve
   * Dispatch an event to the state machine.
   * @param {string} eventName - The name of the event
   * @param {any} data - The data of the event
   * @return {hsm.DispatchResult}
   */
  dispatch(eventName, data) {
    assert(this.state, 'machine is not started.');

    const event = { type: eventName, data };

    this.emit('event', event);

    const result = this.state.dispatch(event);

    if (!result) return { actions: [], entry: [], exit: [] };

    const { actions = [], target } = result;

    if (!target) return { actions };

    const { entry, exit } = this.transition(target, event);
    return { actions, entry, exit };
  }

  /**
   * @preserve
   * Starting the state machine.
   * @return {hsm.DispatchResult}
   **/
  start() {
    return this.transition(this.root.name, { type: '(machine).start' });
  }

  /**
   * @preserve
   * Stopping the state machine.
   * @return {void}
   **/
  stop() {
    this.state = null;
  }

  /**
   * @private
   * Validates the events of the state machine making sure that
   * the target states are valid.
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
   * @private
   * @param {string} stateName - The name of the state
   * @param {hsm.Event} event - The event object
   * @returns {{ entry: hsm.ActionResult[], exit: hsm.ActionResult[] }}
   */
  transition(stateName, event) {
    assert(stateName, 'stateName is required');

    const next = this.state?.getNextState(stateName) || this.states[stateName];
    assert(next, `state not found: ${stateName}`);

    if (next.initial) {
      const prev = this.state;
      this.state = next;
      this.emit('transition', next, prev);
      return this.transition(next.initial, event);
    }

    /**
     * @private
     * @param {StateNode} state - The state node
     * @returns {StateNode[]}
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
     * @private
     * @param {StateNode[]} curAncestors - The current ancestors
     * @param {StateNode[]} nextAncestors - The next ancestors
     * @returns {{ entry: StateNode[], exit: StateNode[] }}
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

    const currentAncestors = ancestors(this.state);
    const nextAncestors = ancestors(next);

    const { entry, exit } = getEntryExit(
      this.state ? [this.state, ...currentAncestors] : currentAncestors,
      [next, ...nextAncestors]
    );

    const exitResults = flatten(exit.map(x => this.exit(x, event)));
    const entryResults = flatten(entry.map(x => this.entry(x, event)));

    const prev = this.state;
    this.state = next;
    this.emit('transition', next, prev);

    return { entry: entryResults, exit: exitResults };
  }

  /**
   * @private
   * @param {StateNode} state - The state node
   * @param {hsm.Event} event - The event object
   * @returns {hsm.ActionResult[]}
   */
  exit(state, event) {
    const actions = state.exit.map(action => {
      const fn = this.setup.actions[action] || action;
      return {
        state: this.state.name,
        action,
        output: fn(this.context, event)
      };
    });

    return actions;
  }

  /**
   * @private
   * @param {StateNode} state - The state node
   * @param {hsm.Event} event - The event object
   * @returns {hsm.ActionResult[]}
   */
  entry(state, event) {
    const actions = state.entry.map(action => {
      const fn = this.setup.actions[action] || action;
      return {
        state: this.state.name,
        action,
        output: fn(this.context, event)
      };
    });

    return actions;
  }
}

export default StateMachine;
