/**
 * @typedef {object} Event
 * @property {string} type - The type of the event
 * @property {object} [data] - The data of the event
 */

/**
 * @callback ActionFunction
 * @param {object} [context={}] - The context of the state machine
 * @param {Event} event - The event of the state machine
 * @returns {any | Promise<any>}
 */

/**
 * @typedef {object} StateMachineSetup
 * @property {Object<string, ActionFunction>} [actions] - The actions of the state machine
 * @property {Object<string, function(any, Event) : boolean>} [guards] - The guards of the state machine
 */

/**
 * @typedef {object} DispatchResult
 * @property {any[]} actions - The actions to execute
 * @property {any[]} entry - The entry actions to execute
 * @property {any[]} exit - The exit actions to execute
 */

import StateNode from './StateNode';
import assert from './utils/assert';
import merge from './utils/merge';

class StateMachine {
  /**
   * @param {object} opts
   * @param {StateConfig} opts.config - The configuration of the state machine
   * @param {StateMachineSetup} opts.setup - The setup of the state machine
   */
  constructor({ config, setup }) {
    setup = merge({}, { actions: {}, guards: {} }, setup);

    assert(config, 'config is required');
    assert(setup, 'setup is required');
    assert(
      setup.actions && typeof setup.actions === 'object',
      'setup.actions is required'
    );
    assert(
      setup.guards && typeof setup.guards === 'object',
      'setup.guards is required'
    );

    this.state = null;
    /** @private */
    this.states = {};

    this.config = config;
    this.setup = setup;
    this.root = new StateNode({ machine: this, name: '(root)', config });
  }

  /**
   * @param {string} eventName - The name of the event
   * @param {object} data - The data of the event
   * @return {DispatchResult}
   */
  dispatch(eventName, data = {}) {
    const ev = { type: eventName, data };
    this.state.dispatch(ev);
  }

  /**
   * @param {string} stateName - The name of the state
   */
  transition(stateName) {}
}

export default StateMachine;
