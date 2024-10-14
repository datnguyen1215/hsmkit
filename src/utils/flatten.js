import assert from './assert';

/**
 * Flatten an array of nested arrays.
 * @param {Array} arr - The array to flatten.
 * @returns {Array} The flattened array.
 **/
const flatten = arr => {
  assert(Array.isArray(arr), 'flatten expects an array');

  return arr.reduce(
    (acc, val) =>
      Array.isArray(val) ? acc.concat(flatten(val)) : acc.concat(val),
    []
  );
};

export default flatten;
