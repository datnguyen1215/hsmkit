import StateEvent from '../src/StateEvent';
import StateNode from '../src/StateNode';
import StateMachine from '../src/StateMachine';
const chai = import('chai');

describe('StateEvent', () => {
  let stateMachine, stateNode, config, actions, guards;

  beforeEach(() => {
    actions = {
      action1: (context, event) => `action1 executed with ${event.data.data}`,
      action2: (context, event) => `action2 executed with ${event.data.data}`,
      asyncAction: async (context, event) => {
        const result = await Promise.resolve(
          `asyncAction executed with ${event.data.data}`
        );
        return result;
      }
    };

    guards = {
      alwaysTrue: () => true,
      alwaysFalse: () => false
    };

    stateMachine = new StateMachine({
      config: { id: 'test', initial: 'initial' },
      setup: { actions, guards }
    });

    stateNode = new StateNode({
      machine: stateMachine,
      name: 'initial',
      parent: null,
      config: {}
    });

    config = [
      { target: 'nextState1', actions: ['action1'], cond: 'alwaysTrue' },
      { target: 'nextState2', actions: ['asyncAction'], cond: 'alwaysTrue' },
      { target: 'nextState3', actions: ['action2'], cond: 'alwaysFalse' }
    ];
  });

  it('should execute actions when guard condition returns true', async () => {
    const { expect } = await chai;
    const eventName = 'EVENT_NAME';
    const event = new StateEvent({ state: stateNode, config, name: eventName });
    const data = 'some data';

    const result = event.execute({ data });

    expect(result).to.deep.equal({
      target: 'nextState1',
      actions: [
        {
          name: 'action1',
          output: `action1 executed with ${data}`
        }
      ]
    });
  });

  it('should execute async actions when guard condition returns true', async () => {
    const { expect } = await chai;
    const eventName = 'EVENT_NAME';
    const event = new StateEvent({
      state: stateNode,
      config: config.slice(1),
      name: eventName
    });
    const data = 'async data';

    const result = event.execute({ data });
    for (const action of result.actions) action.output = await action.output;

    expect(result).to.deep.equal({
      target: 'nextState2',
      actions: [
        {
          name: 'asyncAction',
          output: `asyncAction executed with ${data}`
        }
      ]
    });
  });

  it('should not execute actions when guard condition returns false', async () => {
    const { expect } = await chai;
    const eventName = 'EVENT_NAME';
    const event = new StateEvent({ state: stateNode, config, name: eventName });
    for (const node of event.config) node.cond = 'alwaysFalse';
    const result = event.execute({});
    expect(result).to.be.undefined;
  });

  it('should throw an error for invalid config type', async () => {
    const { expect } = await chai;
    expect(() => {
      new StateEvent({ state: stateNode, config: 123, name: 'INVALID_CONFIG' });
    }).to.throw('Invalid config for event: INVALID_CONFIG');
  });

  it('should handle string config correctly', async () => {
    const { expect } = await chai;
    const event = new StateEvent({
      state: stateNode,
      config: 'nextState1',
      name: 'STRING_CONFIG'
    });
    expect(event.config).to.deep.equal([{ target: 'nextState1' }]);
  });

  it('should handle single object config correctly', async () => {
    const { expect } = await chai;
    const singleObjectConfig = {
      target: 'nextState1',
      actions: ['action1'],
      cond: 'alwaysTrue'
    };
    const event = new StateEvent({
      state: stateNode,
      config: singleObjectConfig,
      name: 'OBJECT_CONFIG'
    });

    expect(event.config).to.deep.equal([singleObjectConfig]);
  });
});
