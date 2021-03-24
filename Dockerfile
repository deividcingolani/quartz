FROM node:lts-alpine
RUN apk add --no-cache git bash
RUN mkdir /.npm && \
    mkdir /.yarn && \
    mkdir -p /usr/local/lib/node_modules && \
    chmod 777 /.npm && \
    chmod 777 /.yarn && \
    chmod 777 /usr/local/lib/node_modules/
