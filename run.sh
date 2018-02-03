#!/bin/bash
pkill whitehall -f
nohup npm start </dev/null >nohup.out 2>&1 &
