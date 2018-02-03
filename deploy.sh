#!/bin/bash
set -e

cd whitehall-subscriber
git fetch --all
git reset --hard origin/master
npm install

./run.sh
