/** @namespace events */

/**
 * @callback events.EventListener
 * @param {...*} args
 * @returns {...*}
 */

/**
 * @callback events.UnsubscribeListener - Unsubscribe the listener.
 * @returns {void}
 */

/**
 * @template TEventEnum
 * @callback events.OnFunction - Subscribe to an event.
 * @param {TEventEnum} name - event name
 * @param {events.EventListener} listener - function to call when the event is emitted
 * @returns {events.UnsubscribeListener}
 */

/**
 * @template TEventEnum
 * @typedef {events.OnFunction<TEventEnum>} events.OnceFunction - Subscribe to an event once.
 */

/**
 * @template TEventEnum
 * @callback events.EmitFunction - Emit an event.
 * @param {TEventEnum} name - event name
 * @param {...*} args - arguments to pass to the listeners
 * @returns {void}
 */

/**
 * @template TEventEnum
 * @typedef {events.OnFunction<TEventEnum>} events.OffFunction - Unsubscribe from an event.
 */

/**
 * @template TEventEnum
 * @typedef {object} events.Emitter - Event emitter.
 * @property {events.OnFunction<TEventEnum>} on - subscribe to an event
 * @property {events.OnceFunction<TEventEnum>} once - subscribe to an event once
 * @property {events.OffFunction<TEventEnum>} off - unsubscribe from an event
 * @property {events.EmitFunction<TEventEnum>} emit - emit an event
 */
