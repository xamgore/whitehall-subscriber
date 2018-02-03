#!/bin/bash
pkill whitehall -f
nohup npm start </dev/null >/dev/null 2>/dev/null &
