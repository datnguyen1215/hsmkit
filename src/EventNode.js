import Action from './Action';
import StateEvent from './StateEvent';
import StateMachine from './StateMachine';

class EventNode {
  /**
   * @param {object} options
   * @param {StateMachine} options.machine
   * @param {StateEvent} options.event
   * @param {hsm.EventConfig} options.config
   */
  constructor({ machine, event, config }) {
    console.log(
      `creating event node ${JSON.stringify(config)} for ${event.name}`
    );

    if (typeof config === 'string') config = { target: config };

    this.machine = machine;
    this.event = event;

    this.target = config.target;

    this.actions = (config.actions || []).map(
      x => new Action({ machine, name: x })
    );

    this.guard = config.guard ? this.machine.guards[config.guard] : null;
  }

  execute(context, event) {
    return this.actions
      .map(x => ({ [x.name]: x.execute(context, event) }))
      .reduce((acc, x) => ({ ...acc, ...x }), {});
  }
}

export default EventNode;
