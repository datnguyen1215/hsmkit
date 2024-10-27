# Using Wildcard Events in `hsmkit`

In `hsmkit`, wildcard events offer a flexible way to handle events that may not have explicit definitions in the state configuration. They are useful in scenarios where you want to ensure that certain actions always execute regardless of the event type or when handling multiple unspecified events in a similar manner.

## How to Use Wildcard Events

To define a wildcard event in your state machine configuration, use the `'*'` key in the `on` configuration of a state. Any event dispatched to that state will trigger the associated actions of the wildcard event if the specific event is not defined.

### Example Usage

```javascript
import { create, assign } from 'hsmkit';

const config = {
  id: 'example',
  initial: 'idle',
  context: {},
  states: {
    idle: {
      on: {
        '*': {
          actions: ['logEvent']
        }
      }
    },
    active: {
      // additional states and transitions
    }
  }
};

const setup = {
  actions: {
    logEvent: ({ context, event, machine }) => {
      console.log(`Wildcard event triggered: ${event.type}`);
    }
  }
};

const machine = create({
  config,
  setup
});

machine.start();
machine.dispatch('SOME_RANDOM_EVENT'); // Logs: Wildcard event triggered: SOME_RANDOM_EVENT
```

In this example, any event dispatched while in the `idle` state will trigger the `logEvent` action because it is set up with a wildcard handler.

### Benefits

- **Simplicity**: Reduces the need to explicitly define handlers for all possible events.
- **Emergency Catch-All**: Acts as a catch-all to prevent unhandled events from causing issues.

## When to Avoid Wildcard Events

While wildcard events can be very handy, they can also make debugging difficult if overused since they can mask specific event handling logic. Use them judiciously, especially in complex state machines where explicit event handling is critical.

By incorporating wildcard events, you enhance your state machine's flexibility and robustness in handling various scenarios seamlessly. Just remember to balance their use with maintainability and clarity.
