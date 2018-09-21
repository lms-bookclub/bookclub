export class Subscriber {
  id: number;
  event: string;
  callback: Function;
  passEventName: boolean;

  constructor(id, event, callback, options) {
    this.id = id;
    this.event = event;
    this.callback = callback;
    this.passEventName = !!options.name;
  }

  trigger(event, ...args) {
    if(this.passEventName) {
      this.callback(event, ...args);
    } else {
      this.callback(...args);
    }
  }

  destroy(){}
}

export class EventHub {
  id?: string;
  private subscribers_: Subscriber[];
  private nextId_: number;

  constructor(id = null) {
    this.id = id;
    this.subscribers_ = [];
    this.nextId_ = 1;
  }

  nextSubscriberID_() {
    return this.nextId_++;
  }

  on(event, options, callback?) {
    if(callback === undefined && typeof options === 'function') {
      callback = options;
      options = {};
    }
    let subscriber = new Subscriber(this.nextSubscriberID_(), event, callback, options);
    subscriber.destroy = this.destroy.bind(this, subscriber);

    this.subscribers_.push(subscriber);

    return subscriber;
  }

  trigger(event, ...args) {
    this.subscribers_
      .filter(s => s.event == event || s.event == null)
      .forEach(s => s.trigger(event, ...args));
  }

  destroy(subscriber) {
    this.subscribers_ = this.subscribers_
      .filter(s => s.id != subscriber.id);
  }
}