# Building first inside a different container
FROM node AS build-stage

WORKDIR /build

COPY package.json .
RUN yarn

COPY src/ ./src/
COPY gulps/ ./gulps/
COPY gulpfile.js ./gulpfile.js

ENV NODE_ENV production
RUN yarn compile

# Deployment stage in production (slim) container
FROM node:slim

WORKDIR /app
RUN npm install http-server -g

CMD ["http-server"]

ENV NODE_ENV production
ENV PORT 5011

COPY --from=build-stage /build/dist .
