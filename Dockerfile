FROM node:alpine

LABEL com.reactuniversalboiler.version="2.0.0" com.reactuniversalboiler.release-date="2017-10-11" author="Steven Truesdell <steven@trues.io>"

RUN apk add --no-cache tini

RUN mkdir -p /usr/src/app/build && \
    mkdir -p /usr/src/app/node_modules && \
    mkdir -p /home/node/.cache/yarn && \
    chown node:node -R /usr/src/app /home/node

USER node

ENTRYPOINT ["/sbin/tini", "--"]
