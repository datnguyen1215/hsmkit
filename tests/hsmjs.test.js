import assign from '../src/assign';
import hsmjs from '../dist/hsmjs.cjs';
const chai = import('chai');

describe('hsm tests', () => {
  /** @type {StateMachine} */
  let machine = null;

  // used to keep track whether the actions were called.
  let states = {
    notifyDisconnected: false,
    connectWebSocket: false,
    disconnectWebSocket: false,
    notifyConnected: false,
    sendMessage: false,
    functionAction: false
  };

  const config = {
    id: 'websocket',
    initial: 'disconnected',
    context: {
      socket: null,
      keepalive: false,
      keepaliveTimeout: 0,
      assign: {
        testL1: {
          testL21: 3,
          testL22: 1
        }
      }
    },
    states: {
      disconnected: {
        entry: [assign({ socket: null }), 'notifyDisconnected'],
        on: {
          '*': {
            actions: ['notifyDisconnected']
          },
          CONNECT: 'connecting',
          TEST_FUNCTION_ACTION: {
            actions: [
              (_, event) => {
                states.functionAction = true;
                return event.data;
              }
            ]
          },
          TEST_ASSIGN_DEEP: {
            actions: [assign({ assign: { testL1: { testL21: 2 } } })]
          }
        }
      },
      connecting: {
        entry: ['connectWebSocket'],
        on: {
          CONNECT_SUCCESS: 'connected',
          CONNECT_FAILURE: 'disconnected',
          STOP: 'disconnected'
        }
      },
      connected: {
        initial: 'idle',
        entry: [assign({ socket: {} }), 'notifyConnected'],
        on: {
          SET_KEEPALIVE: {
            actions: [assign({ keepalive: (_, event) => event.data.keepalive })]
          },

          SET_KEEPALIVE_TIMEOUT: {
            actions: [
              assign({
                keepaliveTimeout: (_, event) => event.data.keepaliveTimeout
              })
            ]
          },

          RESET_KEEPALIVE: {
            actions: [assign({ keepalive: false, keepaliveTimeout: 0 })]
          },
          DISCONNECT: 'disconnecting',
          ERROR: 'disconnected'
        },
        states: {
          idle: {
            on: {
              SEND_MESSAGE: 'sending',
              DISCONNECT: 'websocket.disconnecting'
            }
          },
          sending: {
            entry: ['sendMessage'],
            on: {
              MESSAGE_SENT: 'idle'
            }
          }
        }
      },
      disconnecting: {
        entry: ['disconnectWebSocket'],
        on: {
          DISCONNECT_SUCCESS: 'disconnected'
        }
      }
    }
  };

  it('should create state machine without any setups', async () => {
    const { expect } = await chai;
    const m = hsmjs.create({
      config: {
        id: 'test',
        initial: 'idle',
        states: {
          idle: {
            on: {
              TEST: 'test'
            }
          },
          test: {}
        }
      }
    });

    expect(m).to.be.an('object');
    expect(m).to.have.property('start');
    expect(m).to.have.property('stop');
    expect(m).to.have.property('dispatch');
    expect(m).to.have.property('on');
    expect(m).to.have.property('off');
    expect(m).to.have.property('emit');
    expect(m).to.have.property('context');
    expect(m).to.have.property('root');
    expect(m).to.have.property('states');
    expect(m).to.have.property('setup');
    expect(m.setup).to.have.property('actions');
    expect(m.setup).to.have.property('guards');
    expect(m).to.have.property('config');
  });

  it('should create with no exceptions', async () => {
    const { expect } = await chai;
    machine = hsmjs.create({
      config,
      setup: {
        actions: {
          notifyDisconnected: () => {
            states.notifyDisconnected = true;
          },
          notifyConnected: () => {
            states.notifyConnected = true;
          },
          connectWebSocket: () => {
            return new Promise(async resolve => {
              states.connectWebSocket = true;

              // wait for 2 seconds
              await new Promise(resolve => setTimeout(resolve, 1000));

              machine.dispatch('CONNECT_SUCCESS');
              resolve();
            });
          },
          disconnectWebSocket: async () => {
            states.disconnectWebSocket = true;
          },
          sendMessage: () => {
            states.sendMessage = true;
            setTimeout(() => {
              machine.dispatch('MESSAGE_SENT');
            }, 2000);
          }
        }
      }
    });
    expect(machine).to.be.an('object');
  });

  it('machine should have a root state', async () => {
    const { expect } = await chai;
    machine.start();
    expect(machine.root).to.be.an('object');
    expect(machine.root).to.have.property('name', '(root)');
    expect(machine.root).to.have.property('states');
    expect(machine.root).to.have.property('on');
    expect(machine.root).to.have.property('entry');
    expect(machine.root).to.have.property('exit');
    expect(machine.root).to.have.property('machine');
    expect(machine.root).to.have.property('parent');
    expect(machine.root).to.have.property('id', 'websocket');
    expect(machine.root).to.have.property('initial', 'disconnected');
    expect(states.notifyDisconnected).to.be.true;

    // reset this state so we can test it again.
    states.notifyDisconnected = false;
  });

  it('root state should have child states like configuration', async () => {
    const { expect } = await chai;
    expect(machine.root.states).to.be.an('object');
    expect(machine.root.states).to.have.property('disconnected');
    expect(machine.root.states).to.have.property('connecting');
    expect(machine.root.states).to.have.property('connected');
    expect(machine.root.states).to.have.property('disconnecting');
  });

  it('wildcard event should work properly', async () => {
    const { expect } = await chai;
    const result = machine.dispatch('UNKNOWN_EVENT');
    expect(result).to.be.an('object');
    expect(result).to.have.property('actions');
    expect(result.actions).to.be.an('array');
    expect(result.actions.length).to.equal(1);
    expect(result.actions[0].action).to.equal('notifyDisconnected');
    expect(states.notifyDisconnected).to.be.true;
  });

  it(`should emit 'event' when there's a new event triggered`, done => {
    (async () => {
      const { expect } = await chai;

      const event = { type: 'EVENT_EMITTER_TEST' };

      const onEvent = e => {
        machine.off('event', onEvent);
        expect(e).to.be.an('object');
        expect(e).to.have.property('type', 'EVENT_EMITTER_TEST');
        done();
      };

      machine.on('event', onEvent);
      machine.dispatch(event.type);
    })();
  });

  it('dispatching CONNECT event should allow awaiting for Promise', async () => {
    const { expect } = await chai;
    const result = machine.dispatch('CONNECT', {
      host: 'localhost',
      port: 8080
    });

    const action = result.entry.find(x => x.action === 'connectWebSocket');
    expect(action).to.be.an('object');
    expect(action).to.have.property('output');
    expect(action.output).to.have.property('then');
    await action.output;
    expect(states.connectWebSocket).to.be.true;
    expect(machine.state.name).to.equal('(root).connected.idle');
  });

  it('state should be transitioned to (root).connected.idle', async () => {
    const { expect } = await chai;
    expect(machine.state?.name).to.equal('(root).connected.idle');
  });

  it('context.socket should be an empty object', async () => {
    const { expect } = await chai;
    expect(machine.context).to.be.an('object');
    expect(machine.context).to.have.property('socket');
    expect(machine.context.socket).to.be.an('object');
  });

  it('should set keepalive to true', async () => {
    const { expect } = await chai;
    expect(machine.context.keepalive).to.be.false;
    const result = machine.dispatch('SET_KEEPALIVE', { keepalive: true });
    expect(result).to.be.an('object');
    expect(machine.context.keepalive).to.be.true;
  });

  it('should set keepaliveTimeout to 1000', async () => {
    const { expect } = await chai;
    expect(machine.context.keepaliveTimeout).to.equal(0);
    const result = machine.dispatch('SET_KEEPALIVE_TIMEOUT', {
      keepaliveTimeout: 1000
    });
    expect(result).to.be.an('object');
    expect(machine.context.keepaliveTimeout).to.equal(1000);
  });

  it('should set both keepalive and keepaliveTimeout to false and 0', async () => {
    const { expect } = await chai;
    expect(machine.context.keepalive).to.be.true;
    expect(machine.context.keepaliveTimeout).to.equal(1000);
    const result = machine.dispatch('RESET_KEEPALIVE');
    expect(result).to.be.an('object');
    expect(machine.context.keepalive).to.be.false;
    expect(machine.context.keepaliveTimeout).to.equal(0);
  });

  it('dispatching DISCONNECT event should transition to (root).disconnecting state', async () => {
    const { expect } = await chai;
    const result = machine.dispatch('DISCONNECT');
    expect(result).to.be.an('object');
    expect(result).to.have.property('entry');
    expect(result.entry).to.be.an('array');
    expect(result.entry.length).to.equal(1);
    expect(result.entry[0].action).to.equal('disconnectWebSocket');
    expect(states.disconnectWebSocket).to.be.true;
    expect(machine.state.name).to.equal('(root).disconnecting');
  });

  it(`should emit 'transition' when there's a transition`, done => {
    (async () => {
      const { expect } = await chai;
      const event = { type: 'DISCONNECT_SUCCESS' };

      const onTransition = (next, prev) => {
        machine.off('transition', onTransition);
        expect(next).to.be.an('object');
        expect(next).to.have.property('name', '(root).disconnected');
        expect(prev).to.be.an('object');
        expect(prev).to.have.property('name', '(root).disconnecting');
        done();
      };

      machine.on('transition', onTransition);

      const result = machine.dispatch(event.type);
      expect(result).to.be.an('object');
      expect(result).to.have.property('actions');
      expect(result.actions).to.be.an('array');
      expect(result.actions.length).to.equal(0);
      expect(machine.state.name).to.equal('(root).disconnected');
    })();
  });

  it('context.socket should be null', async () => {
    const { expect } = await chai;
    expect(machine.context).to.be.an('object');
    expect(machine.context).to.have.property('socket', null);
  });

  it('TEST_ACTION_FUNCTION should be excuted properly', async () => {
    const { expect } = await chai;
    const result = machine.dispatch('TEST_FUNCTION_ACTION', 'test data');
    expect(result).to.be.an('object');
    expect(states.functionAction).to.be.true;
    expect(result.actions).to.be.an('array');
    expect(result.actions.length).to.equal(1);
    expect(result.actions[0].output).to.equal('test data');
  });

  it('make sure assign() can modify context deeply', async () => {
    const { expect } = await chai;
    expect(machine.context.assign.testL1.testL21).to.equal(3);
    expect(machine.context.assign.testL1.testL22).to.equal(1);
    const result = machine.dispatch('TEST_ASSIGN_DEEP');
    expect(result).to.be.an('object');
    expect(machine.context.assign.testL1.testL21).to.equal(2);
    expect(machine.context.assign.testL1.testL22).to.equal(1);
  });
});
