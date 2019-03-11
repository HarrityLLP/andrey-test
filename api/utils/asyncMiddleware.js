module.exports = fn => (req, res, next) =>
  Promise.resolve(fn(req))
    .then(([status, data]) => {
      res.status(status);
      res.send(data);
      next();
    })
    .catch((...args) => {
      console.error(...args); // eslint-disable-line
      next(...args);
    });
