// tslint:disable:ban-types
export class EventEmitter {
  private events2handlers: Map<string, Function[]>;

  constructor() {
    this.events2handlers = new Map();
  }

  on(event: string, handler: Function) {
    const handlers = this.events2handlers.get(event);

    if (handlers) {
      return handlers.push(handler);
    }

    this.events2handlers.set(event, [handler]);
  }

  emit(event: string, data: any) {
    const handlers = this.events2handlers.get(event);

    if (!handlers) {
      return;
    }

    handlers.forEach(handler => handler(data));
  }
}
