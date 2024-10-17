# hsmjs: Hierarchical State Machine Library

`hsmjs` is a lightweight JavaScript library alternative to [xState](https://xstate.js.org/) but designed for simplicity and ease of use.

`hsmjs` uses the same syntax as xState without actors, services, parallel states, and other advanced features. If you need any of these, you should consider using xState instead.

It provides a simple API to define states, transitions, actions, and more, making it ideal for developers who want to implement state machines without the extra complexity.

## Features

- Supports hierarchical state machine structures.
- Allows actions and guards to be defined for transitions.
- Provides an event-driven API for dispatching events.
- Allows deep state context modification using the `assign` function.
- Supports [asynchronous actions](./docs/async-actions.md) within state transitions.
- Support [\* wildcard events](./docs/wildcard-events.md) for handling unspecified events.
- Listening to [events/transitions](./docs/state-machine-events.md) of state machine.
- Passing [data to actions and guards](./docs/data-actions-guards.md) using the `context` object.

## Differences from xState

- No support for actors, services, parallel states, and other advanced features.
- No `always` transition type. Why? You can use [\* wildcard events](./docs/wildcard-events.md) instead.
- No support for history states. Why? You can always save your states in an array.
- No support for delayed transitions. Why? `setTimeout` should be enough.
- No support for invoking other machines.

## Installation

```bash
npm install hsmjs
```

## Quick Start

Below is a quick example to create and use a state machine with `hsmjs`.

```javascript
import { create, assign } from 'hsmjs';

// Define the state machine configuration
const config = {
  id: 'websocket',
  initial: 'disconnected',
  context: {
    socket: null,
    keepalive: false,
    keepaliveTimeout: 0
  },
  states: {
    disconnected: {
      entry: [assign({ socket: null }), 'notifyDisconnected'],
      on: {
        CONNECT: 'connecting',
        DISCONNECT: 'disconnecting'
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
      initial: 'idle',
      entry: [assign({ socket: {} }), 'notifyConnected'],
      on: {
        DISCONNECT: 'disconnecting'
      },
      states: {
        idle: {},
        sending: {}
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

// Define actions and setup
const setup = {
  actions: {
    notifyDisconnected: () => console.log('Disconnected'),
    connectWebSocket: () => console.log('Connecting WebSocket'),
    notifyConnected: () => console.log('Connected'),
    disconnectWebSocket: () => console.log('Disconnecting WebSocket')
  }
};

// Create the state machine
const machine = create({
  config,
  setup
});

// Start the state machine
machine.start();

// Dispatch events
machine.dispatch('CONNECT');
machine.dispatch('DISCONNECT');

// Listen to events and transitions
machine.on('event', event => {
  console.log(`Event occurred: ${event.type}`);
});

machine.on('transition', (next, prev) => {
  console.log(`Transitioned from ${prev.name} to ${next.name}`);
});
```

## License

This project is licensed under the MIT License.
