/**
 * Create an event emitter
 * @returns {events.Emitter<string>}
 */
const emitter = () => {
  const listeners = {};

  /** @type {events.OnFunction<string>} */
  const on = (event, callback) => {
    listeners[event] = listeners[event] || [];
    listeners[event].push(callback);
    return () => off(event, callback);
  };

  /** @type {events.OnceFunction<string>} */
  const once = (event, callback) => {
    const handler = (...args) => {
      off(event, handler);
      callback(...args);
    };

    on(event, handler);

    return () => off(event, handler);
  };

  /** @type {events.EmitFunction<string>} */
  const emit = async (event, ...data) => {
    const l = listeners[event] || [];
    await Promise.all(l.map(async callback => callback(...data)));
  };

  /** @type {events.OffFunction<string>} */
  const off = (event, callback) => {
    const l = listeners[event] || [];
    listeners[event] = l.filter(c => c !== callback);
  };

  return { on, off, emit, once };
};

export default emitter;
