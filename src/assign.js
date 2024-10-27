import assert from './utils/assert';
import merge from './utils/merge';

/**
 * Creates an assign action that updates the context of the state machine.
 *
 * @param {object} obj - The object containing keys and values to assign to the context.
 *                        Values can be functions that take the context and event as parameters.
 * @returns {function} - A function that takes the current context and event, then updates the context.
 */
const assign = obj => {
  /**
   * @param {import('./types').ActionOptions} options
   */
  return options => {
    assert(obj, 'obj is required');

    const values = Object.entries(obj).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]: typeof value === 'function' ? value(options) : value
      }),
      {}
    );

    merge(options.context, values);
  };
};

export default assign;
