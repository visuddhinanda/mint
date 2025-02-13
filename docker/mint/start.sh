#!/bin/bash

set -e
if [ "$#" -ne 1 ]; then
    echo "USAGE: $0 PHP_VERSION"
    exit 1
fi

export CODE="mint-$(uname -m)-$1"

podman run --rm -it --events-backend=file --hostname=mint --network host -v $PWD:/workspace:z $CODE
