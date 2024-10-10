import hsm from '../src/hsm';
const chai = import('chai');

describe('hsm tests', () => {
  it('should create with no exceptions', () => {
    const config = {
      initial: 'A',
      states: {
        A: {
          initial: 'B',
          states: {
            B: {
              initial: 'C',
              states: {
                C: {}
              }
            }
          }
        }
      },
      on: {},
      entry: [],
      exit: []
    };
    const machine = hsm.create({ config, setup: { actions: {}, guards: {} } });
  });
});
