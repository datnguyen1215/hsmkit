/** @namespace hsm */

/**
 * @typedef {object} hsm.StateConfig
 * @property {string} initial - The initial state of the state machine
 * @property {string} id - The id of the state.
 * @property {object<string, StateConfig>} states - The states of the state machine
 * @property {object<string, hsm.EventConfig>} on - The events of the state machine
 * @property {string[]} entry - The entry actions of the state machine
 * @property {string[]} exit - The exit actions of the state machine
 */

/**
 * @typedef {object} hsm.Event
 * @property {string} type - The type of the event
 * @property {object} data
 */

/**
 * @callback hsm.ActionFunction
 * @param {object} [context={}] - The context of the state machine
 * @param {Event} event - The event of the state machine
 * @returns {any | Promise<any>}
 */

/**
 * @typedef {object} hsm.StateMachineSetup
 * @property {Object<string, hsm.ActionFunction>} [actions] - The actions of the state machine
 * @property {Object<string, function(any, hsm.Event) : boolean>} [guards] - The guards of the state machine
 */

/**
 * @typedef {object} hsm.DispatchResult
 * @property {any[]} actions
 * @property {any[]} entry
 * @property {any[]} exit
 */

/**
 * @typedef {object} hsm.EventConfig
 * @property {string | hsm.EventNode | hsm.EventNode[]} config

/**
 * @typedef {object} hsm.EventNode
 * @property {string} target - The target state
 * @property {string[]} actions - The actions to execute
 * @property {string} cond - The condition
 */

/**
 * @typedef {object} hsm.ExecuteResult
 * @property {string} target
 * @property {any[]} actions
 */
