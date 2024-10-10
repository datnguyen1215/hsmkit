/**
 * @typedef {object} Event
 * @property {string} type - The type of the event
 * @property {object} data - The data of the event
 */

/**
 * @callback ActionFunction
 * @param {object} context - The context of the state machine
 * @param {Event} event - The event of the state machine
 * @returns {any | Promise<any>}
 */

/**
 * @typedef {object} StateMachineSetup
 * @property {Object<string, ActionFunction>} actions - The actions of the state machine
 * @property {Object<string, function(any, Event) : boolean>} guards - The guards of the state machine
 */

/**
 * @typedef {object} DispatchResult
 * @property {any[]} actions - The actions to execute
 * @property {any[]} entry
 * @property {any[]} exit
 */

import State from './State';

class StateMachine {
  /**
   * @param {object} opts
   * @param {StateConfig} opts.config - The configuration of the state machine
   * @param {StateMachineSetup} opts.setup - The setup of the state machine
   */
  constructor({ config, setup }) {
    this.config = config;
    this.setup = setup;
    this.state = new State({
      machine: this,
      name: '(root)',
      config: this.config,
      parent: null
    });
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
