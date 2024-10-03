/**
 * @typedef {object} EventConfig
 * @property {string} [target]
 * @property {string} [actions]
 * @property {string} [guard]
 */

/**
 * @typedef {Object} StateConfig
 * @property {string} [id]
 * @property {string} [initial]
 * @property {string[]} [beforeEntry]
 * @property {string[]} [entry]
 * @property {string[]} [afterEntry]
 * @property {string[]} [beforeExit]
 * @property {string[]} exit
 * @property {string[]} [afterExit]
 * @property {Object.<string, EventConfig|EventConfig[]} [on]
 * @property {EventConfig|EventConfig[]} [always]
 * @property {Object.<string, StateConfig>} [states]
 */

/**
 * @callback ActionFunction
 * @param {object} context
 * @param {object} data
 * @returns {object}
 */

/**
 * @callback GuardFunction
 * @param {object} context
 * @param {object} data
 * @returns {boolean}
 */

/**
 * @typedef {object} Setup
 * @property {object.<string, ActionFunction>} [actions]
 * @property {object.<string, GuardFunction>} [guards]
 */

import assert from './utils/assert';

/**
 * @param {string[]} actions
 * @param {Setup} setup
 * @returns {Object.<string, ActionFunction[]>}
 */
const getActions = (actions, setup) => {
  if (!actions) return [];

  const results = {};

  actions.forEach(name => {
    const action = setup.actions[name];
    if (!action) throw new Error(`Action ${name} not found in setup.actions`);
    results[name] = action;
  });

  return results;
};

/**
 * @param {EventConfig|string} config
 * @param {Setup} setup
 * @returns {{ execute: (context: object, data: object) => { executed: boolean, outputs: object }}}
 */
const EventNode = (config, setup) => {
  const actions = getActions(config.actions, setup);
  const guard = config.guard ? setup.guards[config.guard] : () => true;
  const { target } = config;

  if (!guard) throw new Error(`Guard ${config.guard} not found in setup.guards`);

  return {
    execute: (context, data) => {
      if (!guard(context, data)) return { executed: false };

      const outputs = {};

      // TODO: Handle async actions
      Object.keys(actions).forEach(name => {
        outputs[name] = actions[name](context, data);
      });

      return { executed: true, target, outputs };
    }
  };
};

/**
 * @param {string} type
 * @param {EventConfig|EventConfig[]|string} config
 * @param {Setup} setup
 */
const StateEvent = (type, config, setup) => {
  assert(typeof type === 'string', 'StateEvent.type must be a string');
  assert(
    config && (typeof config === 'object' || Array.isArray(config) || typeof config === 'string'),
    'StateEvent.config must be an object, array or string'
  );

  console.log('creating state event', type);
  if (typeof config === 'string') config = { target: config };

  const nodes = Array.isArray(config)
    ? config.map(cfg => EventNode(cfg, setup))
    : [EventNode(config, setup)];

  const execute = (context, data) => {
    const { target, outputs } = nodes
      .map(node => node.execute(context, data))
      .find(result => result.executed);

    return { target, outputs };
  };

  return { type, config, execute };
};

/**
 * @param {object} options
 * @param {string} options.name
 * @param {StateConfig} options.config
 * @param {Setup} options.setup
 * @returns {StateNode}
 */
const StateNode = ({ name, config, setup }) => {
  assert(!config.id || typeof config.id === 'string', 'StateNode.id must be a string');
  assert(typeof name === 'string', 'StateNode.name must be a string');
  assert(
    !config.initial || typeof config.initial === 'string',
    'StateNode.initial must be a string'
  );
  assert(
    !config.beforeEntry || Array.isArray(config.beforeEntry),
    'StateNode.beforeEntry must be an array'
  );
  assert(!config.entry || Array.isArray(config.entry), 'StateNode.entry must be an array');
  assert(
    !config.afterEntry || Array.isArray(config.afterEntry),
    'StateNode.afterEntry must be an array'
  );
  assert(
    !config.beforeExit || Array.isArray(config.beforeExit),
    'StateNode.beforeExit must be an array'
  );
  assert(!config.exit || Array.isArray(config.exit), 'StateNode.exit must be an array');
  assert(
    !config.afterExit || Array.isArray(config.afterExit),
    'StateNode.afterExit must be an array'
  );
  assert(!config.on || typeof config.on === 'object', 'StateNode.on must be an object');
  assert(!config.always || typeof config.always === 'object', 'StateNode.always must be an object');
  assert(!config.states || typeof config.states === 'object', 'StateNode.states must be an object');

  console.log('creating state node', name, config);

  /**
   * @type {StateNode}
   */
  let parent = null;

  const events = {};

  // pre-defined events
  if (config.beforeEntry)
    events[`machine.state.${name}.beforeEntry`] = StateEvent(
      `machine.state.${name}.beforeEntry`,
      config.beforeEntry,
      setup
    );
  if (config.entry)
    events[`machine.state.${name}`] = StateEvent(`machine.state.${name}`, config.entry, setup);
  if (config.afterEntry)
    events[`machine.state.${name}.afterEntry`] = StateEvent(
      `machine.state.${name}.afterEntry`,
      config.afterEntry,
      setup
    );
  if (config.always)
    events[`machine.state.always`] = StateEvent(`machine.state.always`, config.always, setup);
  if (config.beforeExit)
    events[`machine.state.${name}.beforeExit`] = StateEvent(
      `machine.state.${name}.beforeExit`,
      config.beforeExit,
      setup
    );
  if (config.exit)
    events[`machine.state.${name}.exit`] = StateEvent(
      `machine.state.${name}.exit`,
      config.exit,
      setup
    );
  if (config.afterExit)
    events[`machine.state.${name}.afterExit`] = StateEvent(
      `machine.state.${name}.afterExit`,
      config.afterExit,
      setup
    );

  Object.keys(config.on || {}).forEach(type => (events[type] = StateEvent(type, config.on, setup)));

  const states = {};
  Object.keys(config.states || {}).forEach(
    name => (states[name] = StateNode({ name, config: config.states[name], setup }))
  );

  const trigger = (event, data = {}) => {
    console.log(`triggering event ${event} in state ${name}`);
    const ev = events[event];

    // support hierarchical state machine
    if (!ev) return parent?.trigger(event, data) || { next: null, outputs: {} };

    const { target, outputs } = ev.execute({}, data);
    return { next: parent?.states[target], outputs };
  };

  return {
    name,
    config,
    events,
    states,
    trigger,
    get parent() {
      return parent;
    },
    set parent(value) {
      parent = value;
    }
  };
};

/**
 * @param {StateConfig} config
 * @param {Setup} setup
 * @returns {StateMachine}
 */
const StateMachine = (config, setup) => {
  console.log('creating state machine', config);
  const root = StateNode({ name: config.id || 'root', config, setup });
  let state = null;

  const assignParents = (node, parent) => {
    node.parent = parent;
    Object.keys(node.states).forEach(name => assignParents(node.states[name], node));
  };

  assignParents(root, null);

  const transition = next => {
    const prev = state;
    if (!Object.values(prev?.states || {}).includes(next)) {
      prev?.trigger(`machine.state.beforeExit`);
      prev?.trigger(`machine.state.exit`);
      prev?.trigger(`machine.state.afterExit`);
    }

    next?.trigger(`machine.state.beforeEntry`);
    state = next;
    state?.trigger(`machine.state.entry`);
    state?.trigger(`machine.state.afterEntry`);
    state?.trigger(`machine.state.always`);

    let initial = state?.config?.initial;
    while (initial) transition(state?.states[initial]);
  };

  transition(root);

  return {
    trigger: (event, data) => {
      console.log(`triggering event ${event}`);
      const { next, outputs } = root.trigger(event, data);

      if (next) transition(next);

      return outputs;
    },

    get state() {
      return state;
    }
  };
};

export default StateMachine;
