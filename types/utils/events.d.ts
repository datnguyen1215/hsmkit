declare namespace _default {
    export { emitter };
    export { Emitter };
}
export default _default;
export type EventListener = (...args: any[]) => any[];
/**
 * - Unsubscribe the listener.
 */
export type UnsubscribeListener = () => void;
export function emitter(): Emitter<any>;
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
export class Emitter<TEventEnum> {
    /**
     * @private
     * @type {Object<TEventEnum, EventListener[]>}
     **/
    private listeners;
    /**
     * Subscribe to an event.
     * @param {TEventEnum} event - event name
     * @param {EventListener} callback - function to call when the event is emitted
     * @returns {UnsubscribeListener} - unsubscribe the listener
     */
    on(event: TEventEnum, callback: EventListener): UnsubscribeListener;
    /**
     * Subscribe to an event once.
     * @param {TEventEnum} event - event name
     * @param {EventListener} callback - function to call when the event is emitted
     * @returns {UnsubscribeListener} - unsubscribe the listener
     */
    once(event: TEventEnum, callback: EventListener): UnsubscribeListener;
    /**
     * Unsubscribe from an event.
     * @param {TEventEnum} event - event name
     * @param {EventListener} callback - function to call when the event is emitted
     * @returns {void}
     */
    off(event: TEventEnum, callback: EventListener): void;
    /**
     * Emit an event.
     * @param {TEventEnum} event - event name
     * @param {...*} data - arguments to pass to the listeners
     * @returns {void}
     */
    emit(event: TEventEnum, ...data: any[]): void;
}
