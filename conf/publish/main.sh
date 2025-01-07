#!/bin/sh
set -e

## Declare variable
ROOT_DIR=${PWD}
REPO_NAME=${1}

## Execute script
echo "[`date`] Execute post-publish script."

### Generate version.log
echo "- Generate version.log with git information"
PUB_DIR=${ROOT_DIR}/cache/publish
REPO_BRANCH=$(git branch --show-current)
REPO_COMMIT_CODE=$(git rev-list --max-count=1 HEAD)
[ ! -e ${PUB_DIR}/version ] && touch ${PUB_DIR}/version
echo ${REPO_NAME// /}, ${REPO_BRANCH// /}, ${REPO_COMMIT_CODE// /} >> ${PUB_DIR}/version
