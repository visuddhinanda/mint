#!/bin/bash

set -e

if [ "$#" -ne 3 ]; then
    echo "USAGE: $0 SSH_USER@SSH_HOST SSH_PORT APP_PORT"
    exit 1
fi

ssh -p $2 -L $3:localhost:$3 $1
