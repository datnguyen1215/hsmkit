export default assign;
/**
 * Creates an assign action that updates the context of the state machine.
 *
 * @param {object} obj - The object containing keys and values to assign to the context.
 *                        Values can be functions that take the context and event as parameters.
 * @returns {function} - A function that takes the current context and event, then updates the context.
 */
declare function assign(obj: object): Function;
