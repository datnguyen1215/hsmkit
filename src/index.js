import StateMachine from './StateNode';

const machine = StateMachine({
  initial: 'idle',
  entry: ['hello'],
  exit: ['goodbye'],
  states: {
    idle: {
      entry: ['log'],
      exit: ['log'],
      on: {
        FETCH: 'loading'
      }
    },
    loading: {
      on: {
        RESOLVE: 'success',
        REJECT: 'failure'
      }
    },
    success: {},
    failure: {}
  }
});

machine.trigger('FETCH');
