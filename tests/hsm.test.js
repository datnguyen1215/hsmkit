import hsm, { StateMachine } from '../src/hsm';
const chai = import('chai');

const config = {
  id: 'websocket',
  initial: 'disconnected',
  context: { socket: null },
  states: {
    disconnected: {
      entry: ['notifyDisconnected'],
      on: {
        '*': {
          actions: ['notifyDisconnected']
        },
        CONNECT: 'connecting'
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
      entry: ['notifyConnected'],
      on: {
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

describe('hsm tests', () => {
  /** @type {StateMachine} */
  let machine = null;

  // used to keep track whether the actions were called.
  let states = {
    notifyDisconnected: false,
    connectWebSocket: false,
    disconnectWebSocket: false,
    notifyConnected: false,
    sendMessage: false
  };

  it('should create with no exceptions', async () => {
    const { expect } = await chai;
    machine = hsm.create({
      config,
      setup: {
        actions: {
          notifyDisconnected: () => {
            console.log('notifyDisconnected');
            states.notifyDisconnected = true;
          },
          notifyConnected: () => {
            console.log('notifyConnected');
            states.notifyConnected = true;
          },
          connectWebSocket: (_, event) => {
            return new Promise(async resolve => {
              states.connectWebSocket = true;
              console.log('connectWebSocket', event);

              // wait for 2 seconds
              await new Promise(resolve => setTimeout(resolve, 1000));

              machine.dispatch('CONNECT_SUCCESS');
              resolve();
            });
          },
          disconnectWebSocket: async () => {
            states.disconnectWebSocket = true;
          },
          sendMessage: (_, event) => {
            states.sendMessage = true;
            setTimeout(() => {
              console.log('sendMessage', event.data);
              machine.dispatch('MESSAGE_SENT');
            }, 2000);
          }
        }
      }
    });
    expect(machine).to.be.an('object');

    machine.on('event', event => {
      console.log('event', event);
    });
    machine.on('transition', (next, prev) => {
      console.log(`transition: ${prev?.name} -> ${next.name}`);
    });
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

  it('dispatching DISCONNECT_SUCCESS event should transition to (root).disconnected state', async () => {
    const { expect } = await chai;
    const result = machine.dispatch('DISCONNECT_SUCCESS');
    expect(result).to.be.an('object');
    expect(result).to.have.property('actions');
    expect(result.actions).to.be.an('array');
    expect(result.actions.length).to.equal(0);
    expect(machine.state.name).to.equal('(root).disconnected');
  });
});
