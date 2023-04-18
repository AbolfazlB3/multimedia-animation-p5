export function randInt(from, to = undefined) {
  if (to == undefined) return Math.floor(Math.random() * from);
  return Math.floor(Math.random() * (to - from)) + from;
}

export function randRange(from, to = undefined) {
  if (to == undefined) return Math.random() * from;
  return Math.random() * (to - from) + from;
}

export function cacheFn(fn) {
  let result = {};
  return function (...args) {
    const key = args.join(",");
    if (result[key] !== undefined) return result[key];
    result[key] = fn(...args);
    return result[key];
  };
}
