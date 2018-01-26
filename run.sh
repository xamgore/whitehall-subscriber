#!/bin/bash
ps -ef | grep -v grep | grep whitehall-subscriber > /dev/null
(( $? )) && { nohup npm start </dev/null &; }
