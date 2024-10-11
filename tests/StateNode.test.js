import StateMachine from '../src/StateMachine';
import StateNode from '../src/StateNode';
const chai = import('chai');

describe('StateNode', () => {
  let config, stateMachine, stateNode;

  beforeEach(() => {
    config = {
      id: 'testState',
      initial: 'child1',
      states: {
        child1: {
          on: { EVENT: 'child2' }
        },
        child2: {}
      },
      entry: ['entryAction'],
      exit: ['exitAction']
    };

    stateMachine = new StateMachine({
      config,
      setup: { actions: {}, guards: {} }
    });

    stateNode = stateMachine.root;
  });

  it('should initialize with correct properties', async () => {
    const { expect } = await chai;
    expect(stateNode).to.have.property('name', 'testState');
    expect(stateNode).to.have.property('machine', stateMachine);
    expect(stateNode).to.have.property('parent', undefined);
    expect(stateNode).to.have.property('id', 'testState');
    expect(stateNode).to.have.property('initial', 'child1');
    expect(stateNode)
      .to.have.property('entry')
      .that.deep.equals(['entryAction']);
    expect(stateNode).to.have.property('exit').that.deep.equals(['exitAction']);
  });

  it('should correctly parse child states', async () => {
    const { expect } = await chai;
    expect(stateNode.states).to.have.property('child1');
    expect(stateNode.states).to.have.property('child2');
    expect(stateNode.states.child1).to.be.an.instanceOf(StateNode);
    expect(stateNode.states.child2).to.be.an.instanceOf(StateNode);
  });

  it('should correctly parse events', async () => {
    const { expect } = await chai;
    expect(stateNode.states.child1.on).to.have.property('EVENT');
    expect(stateNode.states.child1.on.EVENT.config).to.deep.equal([
      { target: 'child2' }
    ]);
  });

  it('should add child states to machine states map', async () => {
    const { expect } = await chai;
    expect(stateMachine.states).to.have.property('testState');
    expect(stateMachine.states).to.have.property('testState.child1');
    expect(stateMachine.states).to.have.property('testState.child2');
  });

  it('should throw an error if constructed without required options', async () => {
    const { expect } = await chai;
    expect(() => new StateNode()).to.throw('opts is required');
  });
});
