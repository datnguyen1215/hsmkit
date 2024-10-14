/**
 * Deeply merges multiple source objects into a target object without modifying the original target.
 * @param {object} target - The target object to merge into.
 * @param {...object} sources - One or more source objects to merge into the target.
 * @returns {object} A new object that is the result of deep merging all sources into the target.
 */
function merge(target, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();

  if (typeof target === 'object' && typeof source === 'object') {
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object') {
        target[key] = target[key] || {};
        merge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
  }

  return merge(target, ...sources);
}

export default merge;
