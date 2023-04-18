export class EventEmitter {
  constructor() {
    this.callbacks = {};
  }

  on(event, cb) {
    if (!this.callbacks[event]) this.callbacks[event] = new Set();
    this.callbacks[event].add(cb);
  }

  off(event, cb) {
    const st = this.callbacks[event];
    if (!st) return;
    st.delete(cb);
    if (st.size === 0) {
      this.callbacks[event] = undefined;
      delete this.callbacks[event];
    }
  }

  emit(event, ...args) {
    let cbs = this.callbacks[event];
    if (cbs) cbs.forEach(cb => cb(...args));
  }

  clear() {
    this.callbacks = {};
  }
}
