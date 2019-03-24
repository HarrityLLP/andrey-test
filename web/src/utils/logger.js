export default new Proxy(
  {},
  {
    get(target, propKey) {
      return function(...args) {
        if (process.env.NODE_ENV === 'test') {
          return () => {};
        }
        return console[propKey](...args);
      };
    }
  }
);
