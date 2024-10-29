#!/bin/bash

set -e

export USAGE="USAGE: $0 fpm"

if [ "$#" -ne 1 ]; then
    echo $USAGE
    exit 1
fi

if [ "$1" == "fpm" ]; then
    echo "start fpm server"
else
    echo $USAGE
    exit 1
fi
