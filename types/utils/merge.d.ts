export default merge;
/**
 * Deeply merges multiple source objects into a target object without modifying the original target.
 * @param {object} target - The target object to merge into.
 * @param {...object} sources - One or more source objects to merge into the target.
 * @returns {object} A new object that is the result of deep merging all sources into the target.
 */
declare function merge(target: object, ...sources: object[]): object;
