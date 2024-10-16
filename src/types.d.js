/**
 * @typedef {object} StateConfig
 * @property {string} initial - The initial state of the state machine
 * @property {string} id - The id of the state.
 * @property {object} context - The context of the state machine
 * @property {Object<string, StateConfig>} states - The states of the state machine
 * @property {Object<string, string | EventNode | EventNode[]>} on - The events of the state machine
 * @property {string[]} entry - The entry actions of the state machine
 * @property {string[]} exit - The exit actions of the state machine
 **/

/**
 * @typedef {object} DispatchEvent
 * @property {string} type - The type of the event
 * @property {object} [data]
 **/

/**
 * @callback ActionFunction
 * @param {object} context - The context of the state machine
 * @param {DispatchEvent} event - The event of the state machine
 * @returns {any | Promise<any>}
 **/

/**
 * @typedef {object} StateMachineSetup
 * @property {Object<string, ActionFunction>} [actions] - The actions of the state machine
 * @property {Object<string, function(any, DispatchEvent) : boolean>} [guards] - The guards of the state machine
 **/

/**
 * @typedef {object} EventConfig
 * @property {string | EventNode | EventNode[]} config

/**
 * @typedef {object} EventNode
 * @property {string} [target] - The target state
 * @property {string[] | ActionFunction[]} [actions] - The actions to execute
 * @property {string} [cond] - The condition
 **/

/**
 * @typedef {object} ExecuteResult
 * @property {string} [target]
 * @property {ActionResult[]} [actions]
 **/

/**
 * @typedef {object} ActionResult
 * @property {string} state - Name of the state
 * @property {string} action - Name of the action
 * @property {any} [output] - Output of the action
 **/
