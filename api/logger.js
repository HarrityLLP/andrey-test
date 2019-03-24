module.exports = new Proxy(
  {},
  {
    get(target, methodName) {
      return function(...args) {
        return (console[methodName] || console.log)(...args);
      };
    }
  }
);
