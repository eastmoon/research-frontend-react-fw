#!/bin/sh
# vim:sw=4:ts=4:et
set -e

if [ -z ${1} ]; then
    tail -f /dev/null
elif [ "${1}" = "init" ]; then
    npm install
elif [ "${1}" = "dev" ]; then
    npm run dev -- --port ${PORT}
elif [ "${1}" = "sb" ]; then
    npm run storybook -- --port ${PORT}
elif [ "${1}" = "mocha" ]; then
    npm run mocha
elif [ "${1}" = "build" ]; then
    npm install
    npm run build
else
    exec "$@"
fi
