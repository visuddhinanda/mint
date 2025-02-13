#!/bin/bash

set -e

export PHP_VERSION="8.1"
export CODE="mint-php${PHP_VERSION}"

export USAGE="USAGE: $0 MINT_VERSION TASK"

if [ "$#" -ne 2 ]; then
    echo $USAGE
    exit 2
fi

if [ "$2" == "fpm" || "$2" == "worker" ]; then
    podman run --rm -it --events-backend=file --hostname=mint --network host -v $PWD:/srv:z $CODE /srv/launch.sh $2
elif [ "$1" == "setup" ]; then
    cd /srv/www/mint-
elif [ "$1" == "shell" ]; then
    podman run --rm -it --events-backend=file --hostname=mint --network host -v $PWD:/srv:z $CODE /bin/bash
else
    echo $USAGE
    exit 1
fi
