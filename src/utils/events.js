/**
 * @preserve
 * @class Emitter
 * @template TEventEnum
 */
class Emitter {
  constructor() {
    /**
     * @preserve
     * @private
     * @type {Object<TEventEnum, events.EventListener[]>}
     **/
    this.listeners = {};
  }

  /**
   * @preserve
   * Subscribe to an event.
   * @param {TEventEnum} event - event name
   * @param {events.EventListener} callback - function to call when the event is emitted
   * @returns {events.UnsubscribeListener} - unsubscribe the listener
   */
  on(event, callback) {
    this.listeners[event] = this.listeners[event] || [];
    this.listeners[event].push(callback);
    return () => this.off(event, callback);
  }

  /**
   * @preserve
   * Subscribe to an event once.
   * @template TEventEnum
   * @param {TEventEnum} event - event name
   * @param {events.EventListener} callback - function to call when the event is emitted
   * @returns {events.UnsubscribeListener}
   */
  once(event, callback) {
    const handler = (...args) => {
      this.off(event, handler);
      callback(...args);
    };

    this.on(event, handler);
  }

  /**
   * @preserve
   * Unsubscribe from an event.
   * @template TEventEnum
   * @param {TEventEnum} event - event name
   * @param {events.EventListener} callback - function to call when the event is emitted
   * @returns {void}
   */
  off(event, callback) {
    const l = this.listeners[event] || [];
    this.listeners[event] = l.filter(c => c !== callback);
  }

  /**
   * @preserve
   * Emit an event.
   * @template TEventEnum
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
