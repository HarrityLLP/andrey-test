FROM node:alpine

RUN mkdir -p /usr/src/api

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

ARG PORT=80
ENV PORT $PORT
EXPOSE $PORT 9229 9230

WORKDIR /usr/src/api

COPY package.json package-lock.json* ./
RUN npm install && npm cache clean --force

COPY . .

HEALTHCHECK --interval=30s CMD curl -fs http://localhost:$PORT/healthz || exit 1

CMD [ "node", "index.js" ]