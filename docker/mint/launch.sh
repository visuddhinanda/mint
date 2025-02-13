#!/bin/bash

set -e

export USAGE="USAGE: $0 MINT_VERSION TASK"

if [ "$#" -ne 2 ]; then
    echo $USAGE
    exit 2
fi

if [ "$2" == "fpm" ]; then
    echo "start fpm server($1)"
elif [ "$1" == "shell" ]; then
    echo "start $2 for $1"
else
    echo $USAGE
    exit 1
fi
