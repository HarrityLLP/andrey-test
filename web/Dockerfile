# develop stage
FROM node:10-alpine as develop-stage
WORKDIR /usr/src/web
COPY package*.json ./
RUN npm install
COPY . .

# build stage
FROM develop-stage as build-stage
RUN npm run build

# production stage
FROM nginx:alpine as production-stage
COPY --from=build-stage /usr/src/web/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]