/**
 * @typedef {'transition' | 'event'} BaseEvent
 **/

import StateNode from './StateNode';
import assert from './utils/assert';
import merge from './utils/merge';
import flatten from './utils/flatten';
import { Emitter } from './utils/events';
import DispatchResult from './DispatchResult';

const DEFAULT_SETUP = { actions: {}, guards: {} };

/**
 * @template {object} [TContext=never]
 * @template {string} [TEvent=never]
 * @class
 * @extends {Emitter<BaseEvent | TEvent>}
 */
class StateMachine extends Emitter {
  /**
   * State machine instance.
   * @param {object} opts
   * @param {import('./types').StateConfig} opts.config - The configuration of the state machine
   * @param {import('./types').StateMachineSetup} opts.setup - The setup of the state machine
   */
  constructor({ config, setup }) {
    super();

    setup = merge({}, { actions: {}, guards: {} }, setup);

    assert(config, 'config is required');

    /**
     * @private
     * @type {StateNode}
     **/
    this._state = null;

    /**
     * @type {Object<string, StateNode>}
     **/
    this.states = {};

    /**
     * @type {import('./types').StateConfig}
     **/
    this.config = config;

    /** @type {object | TContext} **/
    this.context = this.config.context || {};

    /**
     * @type {import('./types').StateMachineSetup}
     **/
    this.setup = merge({}, DEFAULT_SETUP, setup);

    /**
     * @type {StateNode}
     **/
    this.root = new StateNode({
      machine: this,
      name: '(root)',
      config
    });

    this.validateEvents();
  }

  /**
   * @type {StateNode}
   **/
  get state() {
    if (!this._state) throw new Error('machine is not started.');
    return this._state;
  }

  /**
   * Dispatch an event to the state machine.
   * @param {string} eventName - Name of the event to be triggered.
   * @param {any} data - Data to be passed into actions/guards.
   * @return {DispatchResult} Result of the dispatch.
   */
  dispatch(eventName, data) {
    assert(this._state, 'machine is not started.');

    const event = { type: eventName, data };

    this.emit('event', event);

    const result = this._state.dispatch(event);

    if (!result)
      return new DispatchResult({ actions: [], entry: [], exit: [] });

    const { actions = [], target } = result;

    if (!target) return new DispatchResult({ actions });

    const { entry, exit } = this.transition(target, event);
    return new DispatchResult({ actions, entry, exit });
  }

  /**
   * Starting the state machine.
   * @return {DispatchResult} Result of the dispatch (usually entry/exit).
   **/
  start() {
    return new DispatchResult(
      this.transition(this.root, { type: '(machine).start' })
    );
  }

  /**
   * Stopping the state machine.
   * @return {void}
   **/
  stop() {
    this._state = null;
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
   * @param {StateNode} next - The name of the state
   * @param {import('./types').DispatchEvent} event - The event object
   * @returns {{ entry: import('./types').ActionResult[], exit: import('./types').ActionResult[] }}
   */
  transition(next, event) {
    assert(next, 'next state is required');

    if (next.initial) {
      const prev = this._state;
      this._state = next;
      this.emit('transition', next, prev);
      return this.transition(next.states[next.initial], event);
    }

    /**
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
   * @private
   * @param {StateNode} state - The state node
   * @param {import('./types').DispatchEvent} event - The event object
   * @returns {import('./types').ActionResult[]}
   */
  exit(state, event) {
    const actions = state.exit.map(action => {
      const fn = this.setup.actions[action] || action;
      return {
        state: this._state.name,
        action,
        output: fn({ context: this.context, event, machine: this })
      };
    });

    return actions;
  }

  /**
   * @private
   * @param {StateNode} state - The state node
   * @param {import('./types').DispatchEvent} event - The event object
   * @returns {import('./types').ActionResult[]}
   */
  entry(state, event) {
    const actions = state.entry.map(action => {
      const fn = this.setup.actions[action] || action;
      return {
        state: this._state.name,
        action,
        output: fn({ context: this.context, event, machine: this })
      };
    });

    return actions;
  }
}

export default StateMachine;
