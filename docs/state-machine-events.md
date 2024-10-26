# Listening to Events with `hsmkit`

In `hsmkit`, you can listen to state machine events and transitions to perform actions when specific events occur or states change. This is useful for handling side-effects or updating your application based on the state machine's activity.

## Listening to Events

To listen to all events dispatched to the state machine, use the `event` listener. This allows you to react to any event occurring in the machine.

### Example

```javascript
// Start the machine first
machine.start();

// Listen for a specific event
machine.on('event', event => {
  console.log(`Event occurred: ${event.type}`);
});
```

This will log every event dispatched to the machine, allowing you to handle them as needed.

## Listening to Transitions

To listen for state transitions, use the `transition` event. This allows you to execute code whenever the state machine changes from one state to another.

### Example

```javascript
// Start the machine first
machine.start();

// Listen for state transitions
machine.on('transition', (next, prev) => {
  console.log(`Transitioned from ${prev.name} to ${next.name}`);
});
```

This will log every transition that occurs, showing the previous and next state names.

## Additional Notes

- Use `machine.off` to remove specific event listeners when they are no longer needed.
- Be mindful of potential side-effects when handling events and transitions, especially in larger state machines.

By leveraging event and transition listeners, you can effectively manage application state and side-effects in response to state machine activity.
