/**
 * Deeply merges multiple source objects into a target object without modifying the original target.
 * @param {object} target - The target object to merge into.
 * @param {...object} sources - One or more source objects to merge into the target.
 * @returns {object} A new object that is the result of deep merging all sources into the target.
 */
function merge(target, ...sources) {
  const output = { ...target };

  if (!sources.length) return output;
  const source = sources.shift();

  if (typeof output === 'object' && typeof source === 'object') {
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object') {
        output[key] = output[key] || {};
        output[key] = merge(output[key], source[key]);
      } else {
        output[key] = source[key];
      }
    }
  }

  return merge(output, ...sources);
}

export default merge;
