import StateMachine from './StateMachine';

const create = (config, setup) => new StateMachine(config, setup);

export default create;
