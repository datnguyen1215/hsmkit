import hsm from '../src/hsm';
const chai = import('chai');

const config = {
  id: 'websocket',
  initial: 'disconnected',
  states: {
    disconnected: {
      on: {
        CONNECT: 'connecting'
      }
    },
    connecting: {
      entry: ['connectWebSocket'],
      on: {
        CONNECT_SUCCESS: 'connected',
        CONNECT_FAILURE: 'disconnected'
      }
    },
    connected: {
      on: {
        DISCONNECT: 'disconnecting',
        ERROR: 'disconnected'
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
  let machine = null;

  it('should create with no exceptions', async () => {
    const { expect } = await chai;
    machine = hsm.create({ config, setup: { actions: {}, guards: {} } });
    expect(machine).to.be.an('object');
  });

  it('machine should have a root state', async () => {
    const { expect } = await chai;
    expect(machine.root).to.be.an('object');
    expect(machine.root).to.have.property('name', 'websocket');
    expect(machine.root).to.have.property('states');
    expect(machine.root).to.have.property('on');
    expect(machine.root).to.have.property('entry');
    expect(machine.root).to.have.property('exit');
    expect(machine.root).to.have.property('machine');
    expect(machine.root).to.have.property('parent');
    expect(machine.root).to.have.property('id', 'websocket');
    expect(machine.root).to.have.property('initial', 'disconnected');
  });

  it('root state should have child states like configuration', async () => {
    const { expect } = await chai;
    expect(machine.root.states).to.be.an('object');
    expect(machine.root.states).to.have.property('disconnected');
    expect(machine.root.states).to.have.property('connecting');
    expect(machine.root.states).to.have.property('connected');
    expect(machine.root.states).to.have.property('disconnecting');
  });
});
