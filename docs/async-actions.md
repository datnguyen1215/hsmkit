# Handling Asynchronous Actions

In `xState`, handling asynchronous actions typically requires introducing additional states to accommodate the asynchronous operation, which can make the state machine configuration more complex. This often involves creating separate states for loading, success, and error scenarios.

`hsmkit` allows you to directly wait for the `asyncAction` to complete without needing additional states for handling asynchronous behavior.

## Example Usage

```javascript
import { create } from 'hsmkit';

// Setup your machine with async actions
const setup = {
  actions: {
    asyncAction: (context, event) => {
      return new Promise(resolve => setTimeout(() => resolve('done'), 1000));
    }
  }
};

// Define the state machine
const config = {
  id: 'example',
  initial: 'state1',
  states: {
    state1: {
      on: {
        EVENT: {
          target: 'state2',
          actions: ['asyncAction']
        }
      }
    },
    state2: {}
  }
};

// Create the state machine
const machine = create({
  config,
  setup
});

// Start the machine
machine.start();

// Dispatch an event and wait for specific action
const result = machine.dispatch('EVENT');

// Wait for the specific async action to complete
result.wait('asyncAction').then(output => {
  console.log(`Async action completed with output: ${output}`);
});

// Or wait for all actions to complete
result.waitAll().then(outputs => {
  console.log('All actions completed:', outputs);
});
```
