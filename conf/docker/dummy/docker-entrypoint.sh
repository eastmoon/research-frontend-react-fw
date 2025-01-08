#!/bin/sh
# vim:sw=4:ts=4:et
set -e

if [ -z ${1} ]; then
    tail -f /dev/null
elif [ "${1}" = "init" ]; then
    npm install
elif [ "${1}" = "dummy" ]; then
    npm run start -- --port ${PORT} --host 0.0.0.0
else
    exec "$@"
fi
