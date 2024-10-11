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
      entry: 'connectWebSocket',
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
      entry: 'disconnectWebSocket',
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
    expect(machine.root).to.have.property('name', '(root)');
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

  it('(root).disconnected should have on CONNECT event', async () => {
    const { expect } = await chai;
    expect(machine.root.states.disconnected).to.be.an('object');
    expect(machine.root.states.disconnected.on).to.be.an('object');
    expect(machine.root.states.disconnected.on).to.have.property('CONNECT');
    // expect CONNECT to be an array
    expect(machine.root.states.disconnected.on.CONNECT).to.be.an('object');
    expect(machine.root.states.disconnected.on.CONNECT).to.have.property(
      'state',
      machine.root.states.disconnected
    );
    expect(machine.root.states.disconnected.on.CONNECT).to.have.property(
      'name',
      'CONNECT'
    );
    expect(machine.root.states.disconnected.on.CONNECT.config).to.deep.equal([
      { target: 'connecting' }
    ]);
  });

  // it('(root).connecting should have entry action connectWebSocket', async () => {
  //   const { expect } = await chai;
  //   expect(machine.root.states.connecting).to.be.an('object');
  //   expect(machine.root.states.connecting.entry).to.be.an('array');
  //   expect(machine.root.states.connecting.entry).to.have.lengthOf(1);
  //   expect(machine.root.states.connecting.entry[0]).to.equal(
  //     'connectWebSocket'
  //   );
  // });
  //
  // it('(root).connecting should have on CONNECT_SUCCESS event', async () => {
  //   const { expect } = await chai;
  //   expect(machine.root.states.connecting.on).to.be.an('object');
  //   expect(machine.root.states.connecting.on).to.have.property(
  //     'CONNECT_SUCCESS',
  //     'connected'
  //   );
  // });
  //
  // it('(root).connecting should have on CONNECT_FAILURE event', async () => {
  //   const { expect } = await chai;
  //   expect(machine.root.states.connecting.on).to.be.an('object');
  //   expect(machine.root.states.connecting.on).to.have.property(
  //     'CONNECT_FAILURE',
  //     'disconnected'
  //   );
  // });
  //
  // it('(root).connected should have on DISCONNECT event', async () => {
  //   const { expect } = await chai;
  //   expect(machine.root.states.connected.on).to.be.an('object');
  //   expect(machine.root.states.connected.on).to.have.property(
  //     'DISCONNECT',
  //     'disconnecting'
  //   );
  // });
  //
  // it('(root).connected should have on ERROR event', async () => {
  //   const { expect } = await chai;
  //   expect(machine.root.states.connected.on).to.be.an('object');
  //   expect(machine.root.states.connected.on).to.have.property(
  //     'ERROR',
  //     'disconnected'
  //   );
  // });
  //
  // it('(root).disconnecting should have entry action disconnectWebSocket', async () => {
  //   const { expect } = await chai;
  //   expect(machine.root.states.disconnecting).to.be.an('object');
  //   expect(machine.root.states.disconnecting.entry).to.be.an('array');
  //   expect(machine.root.states.disconnecting.entry).to.have.lengthOf(1);
  //   expect(machine.root.states.disconnecting.entry[0]).to.equal(
  //     'disconnectWebSocket'
  //   );
  // });
});
