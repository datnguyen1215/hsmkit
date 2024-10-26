# Passing Data to Actions and Guards in `hsmkit`

In `hsmkit`, passing data to actions and guards is straightforward. When you dispatch an event, you can include additional data that will be accessible in your action functions and guard conditions. This allows for dynamic behavior based on the specifics of each event.

## How to Pass Data

When dispatching an event, include a second parameter with your data. This data becomes part of the event object passed to actions and guards.

### Example

```javascript
import { create, assign } from 'hsmkit';

// Define your state machine configuration
const config = {
  id: 'example',
  initial: 'idle',
  states: {
    idle: {
      on: {
        START: {
          target: 'active',
          actions: ['logDetails']
        }
      }
    },
    active: {}
  }
};

const setup = {
  actions: {
    logDetails: (context, event) => {
      console.log(`Starting with details: ${event.data.details}`);
    }
  },
  guards: {
    isValid: (context, event) => {
      return event.data && event.data.isValid;
    }
  }
};

const machine = create({
  config,
  setup
});

// Start the machine
machine.start();

// Dispatch an event with data
machine.dispatch('START', {
  details: 'Initializing process...',
  isValid: true
});
```

In this example, when the `START` event is dispatched, `logDetails` action will log the message, including the `details` data passed with the event. Similarly, the guard `isValid` could be used to conditionally allow transitions based on the event data.

## Benefits

- **Flexibility**: Easily modify state transitions and actions based on event-specific data.
- **Readability**: Keep your state logic clear and focused by handling specifics in actions and guards.

## Example Guard

You can add guards to transition conditions to check data validity before proceeding.

```javascript
states: {
  idle: {
    on: {
      START: {
        target: 'active',
        actions: ['logDetails'],
        cond: 'isValid' // Check if the event data is valid
      }
    }
  }
}
```

With this setup, the transition to the `active` state only occurs if the `isValid` guard evaluates to true based on the dispatched event data.

By passing data to actions and guards, you can make your state machine behave dynamically, responding appropriately to the context of each event.
