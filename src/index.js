import StateChart from './hsm';

const machine = StateChart(
  {
    initial: 'idle',
    entry: ['hello'],
    exit: ['goodbye'],
    on: {
      HELLO: {
        target: 'hello',
        actions: ['hello', 'world']
      }
    },
    always: {
      actions: ['alwaysFunction']
    },
    states: {
      idle: {
        initial: 'inner',
        entry: ['log'],
        exit: ['log'],
        states: {
          inner: {
            always: {
              actions: ['alwaysFunction']
            },
            on: {
              FETCH: 'working'
            }
          },
          working: {
            on: {
              HELLO: {
                actions: ['asyncFunction']
              }
            }
          },
          done: {}
        }
      },
      loading: {
        on: {
          RESOLVE: 'success',
          REJECT: 'failure'
        }
      },
      hello: {
        on: {
          WORLD: 'idle'
        }
      },
      success: {},
      failure: {}
    }
  },
  {
    actions: {
      log: () => {
        console.log(`I'm wirint log from action [log]`);
      },
      hello: () => {
        console.log(`I'm writing 'hello' from [hello] action`);
        return 'yooo';
      },
      world: () => {
        return 'loooo';
      },
      goodbye: () => {
        console.log(`I'm writing 'goodbye' from [goodbye] action`);
      },
      alwaysFunction: () => {
        console.log('launching always function');
      },
      asyncFunction: async () => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve('async function done');
          }, 1000);
        });
      }
    }
  }
);

machine.start();
machine.dispatch('FETCH');
machine.dispatch('HELLO');
machine.dispatch('WORLD');
