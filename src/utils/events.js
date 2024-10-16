/**
 * @callback EventListener
 * @param {...*} args
 * @returns {...*}
 */

/**
 * @callback UnsubscribeListener - Unsubscribe the listener.
 * @returns {void}
 */

/**
 * @class
 * @template TEventEnum
 */
class Emitter {
  constructor() {
    /**
     * @private
     * @type {Object<TEventEnum, EventListener[]>}
     **/
    this.listeners = {};
  }

  /**
   * Subscribe to an event.
   * @param {TEventEnum} event - event name
   * @param {EventListener} callback - function to call when the event is emitted
   * @returns {UnsubscribeListener} - unsubscribe the listener
   */
  on(event, callback) {
    this.listeners[event] = this.listeners[event] || [];
    this.listeners[event].push(callback);
    return () => this.off(event, callback);
  }

  /**
   * Subscribe to an event once.
   * @param {TEventEnum} event - event name
   * @param {EventListener} callback - function to call when the event is emitted
   * @returns {UnsubscribeListener} - unsubscribe the listener
   */
  once(event, callback) {
    const handler = (...args) => {
      this.off(event, handler);
      callback(...args);
    };

    this.on(event, handler);

    return () => this.off(event, handler);
  }

  /**
   * Unsubscribe from an event.
   * @param {TEventEnum} event - event name
   * @param {EventListener} callback - function to call when the event is emitted
   * @returns {void}
   */
  off(event, callback) {
    const l = this.listeners[event] || [];
    this.listeners[event] = l.filter(c => c !== callback);
  }

  /**
   * Emit an event.
   * @param {TEventEnum} event - event name
   * @param {...*} data - arguments to pass to the listeners
   * @returns {void}
   */
  emit(event, ...data) {
    const l = this.listeners[event] || [];
    l.forEach(callback => callback(...data));
  }
}

const emitter = () => new Emitter();

export default { emitter, Emitter };
export { emitter, Emitter };
