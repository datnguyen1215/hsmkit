import assert from './utils/assert';

/**
 * @param {object} obj
 */
const assign = obj => (context, event) => {
  assert(obj, 'obj is required');

  Object.entries(obj).forEach(([key, value]) => {
    if (typeof value === 'function') context[key] = value(context, event);
    else context[key] = value;
  });
};

export default assign;
