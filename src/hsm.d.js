/** @namespace hsm */

/**
 * @typedef {object} StateConfig
 * @property {string} initial - The initial state of the state machine
 * @property {object<string, StateConfig>} states - The states of the state machine
 * @property {object<string, EventConfig>} on - The events of the state machine
 * @property {string[]} entry - The entry actions of the state machine
 * @property {string[]} exit - The exit actions of the state machine
 */
