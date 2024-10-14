/** @namespace hsm */

/**
 * @typedef {object} hsmjs.StateConfig
 * @property {string} initial - The initial state of the state machine
 * @property {string} id - The id of the state.
 * @property {object<string, StateConfig>} states - The states of the state machine
 * @property {object<string, hsmjs.EventConfig>} on - The events of the state machine
 * @property {string[]} entry - The entry actions of the state machine
 * @property {string[]} exit - The exit actions of the state machine
 */

/**
 * @typedef {object} hsmjs.Event
 * @property {string} type - The type of the event
 * @property {object} data
 */

/**
 * @callback hsmjs.ActionFunction
 * @param {object} [context={}] - The context of the state machine
 * @param {Event} event - The event of the state machine
 * @returns {any | Promise<any>}
 */

/**
 * @typedef {object} hsmjs.StateMachineSetup
 * @property {Object<string, hsmjs.ActionFunction>} [actions] - The actions of the state machine
 * @property {Object<string, function(any, hsmjs.Event) : boolean>} [guards] - The guards of the state machine
 */

/**
 * @typedef {object} hsmjs.DispatchResult
 * @property {hsmjs.ActionResult[]} [actions]
 * @property {hsmjs.ActionResult[]} [entry]
 * @property {hsmjs.ActionResult[]} [exit]
 */

/**
 * @typedef {object} hsmjs.EventConfig
 * @property {string | hsmjs.EventNode | hsmjs.EventNode[]} config

/**
 * @typedef {object} hsmjs.EventNode
 * @property {string} [target] - The target state
 * @property {string[]} [actions] - The actions to execute
 * @property {string} [cond] - The condition
 */

/**
 * @typedef {object} hsmjs.ExecuteResult
 * @property {string} [target]
 * @property {hsmjs.ActionResult[]} [actions]
 */

/**
 * @typedef {object} hsmjs.ActionResult
 * @property {string} state - Name of the state
 * @property {string} action - Name of the action
 * @property {any} [output] - Output of the action
 */
