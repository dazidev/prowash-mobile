type AuthEvent = 'session-expired';

type Listener = () => void;

class AuthEventServiceClass {
  private listeners: Record<AuthEvent, Listener[]> = {
    'session-expired': [],
  };

  subscribe(event: AuthEvent, listener: Listener) {
    this.listeners[event].push(listener);

    return () => {
      this.listeners[event] = this.listeners[event].filter(
        item => item !== listener,
      );
    };
  }

  emit(event: AuthEvent) {
    this.listeners[event].forEach(listener => listener());
  }
}

export const AuthEventService = new AuthEventServiceClass();
