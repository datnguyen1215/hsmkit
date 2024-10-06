import StateChart from './hsm';

const machine = StateChart(
  {
    initial: 'unauthenticated',
    on: {
      LOGOUT: {
        target: 'unauthenticated',
        actions: ['clearUserData']
      }
    },
    states: {
      unauthenticated: {
        on: {
          LOGIN: {
            target: 'authenticating',
            actions: ['logLoginAttempt']
          },
          // shouldn't do anything
          LOGOUT: {}
        }
      },
      authenticating: {
        entry: ['authenticateUser'],
        on: {
          AUTH_SUCCESS: {
            target: 'authenticated',
            actions: ['setUser']
          },
          AUTH_FAILURE: {
            target: 'authFailed',
            actions: ['logError']
          }
        }
      },
      authenticated: {
        initial: 'idle',
        entry: ['fetchUserData'],
        states: {
          idle: {
            on: {
              VIEW_PROFILE: 'viewingProfile'
            }
          },
          viewingProfile: {
            on: {
              EDIT_PROFILE: {
                target: 'editingProfile',
                actions: ['logProfileEdit']
              }
            }
          },
          editingProfile: {
            on: {
              SAVE_PROFILE: {
                target: 'idle',
                actions: ['saveProfileData']
              },
              CANCEL: 'viewingProfile'
            }
          }
        }
      },
      authFailed: {
        on: {
          RETRY: 'authenticating'
        }
      }
    }
  },
  {
    actions: {
      logLoginAttempt: () => console.log('User login attempt'),
      authenticateUser: async (context, event) => {
        console.log('Authenticating user:', event.data);
        return await login(event.data.username, event.data.password);
      },
      setUser: (context, event) => {
        context.user = event.data.user;
        console.log('User set:', context.user);
      },
      logError: (context, event) => {
        console.log('Login failed: ', event.data.error);
      },
      fetchUserData: context =>
        console.log('Fetching user data for:', context.user),
      clearUserData: context => (context.user = null),
      logProfileEdit: () => console.log('Editing profile mode'),
      saveProfileData: (context, event) =>
        console.log('Profile saved with:', event.data)
    }
  }
);

const login = async (username, password) => {
  try {
    if (!username || !password)
      throw new Error('Username and password required');

    await new Promise(resolve => setTimeout(resolve, 1000));

    machine.dispatch('AUTH_SUCCESS', { user: { name: 'John Doe' } });
  } catch (error) {
    machine.dispatch('AUTH_FAILURE', { error });
  }
};

machine.start();
machine.dispatch('LOGOUT');
machine.dispatch('LOGIN', { username: 'yoo', password: 'bar' });
