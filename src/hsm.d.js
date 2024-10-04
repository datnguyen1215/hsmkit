/** @namespace hsm */

/**
 * @typedef {object} hsm.EventConfig
 * @property {string} [target]
 * @property {string} [actions]
 * @property {string} [guard]
 */

/**
 * @typedef {Object} StateNodeConfig
 * @property {string} [id]
 * @property {string} [initial]
 * @property {string[]} [entry]
 * @property {string[]} exit
 * @property {Object.<string, EventConfig|EventConfig[]} [on]
 * @property {EventConfig|EventConfig[]} [always]
 * @property {Object.<string, StateConfig>} [states]
 */

/**
 * @callback ActionFunction
 * @param {object} context
 * @param {object} data
 * @returns {object}
 */

/**
 * @callback GuardFunction
 * @param {object} context
 * @param {object} data
 * @returns {boolean}
 */

/**
 * @typedef {object} Setup
 * @property {object.<string, ActionFunction>} [actions]
 * @property {object.<string, GuardFunction>} [guards]
 */
