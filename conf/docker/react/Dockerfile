FROM node:20

# Install tools
RUN apt-get update
RUN apt-get install -y \
    xdg-utils

# Update node.js
RUN npm update -g

# Setting Container
WORKDIR /repo
ENV CHOKIDAR_USEPOLLING=true
ENV CHOKIDAR_INTERVAL=500

# COMMAND
ADD docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
