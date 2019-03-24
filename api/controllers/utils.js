const ok = data => [200, data];
const badRequest = () => [400];
const notFound = () => [404];

module.exports = {
  ok,
  badRequest,
  notFound
};
