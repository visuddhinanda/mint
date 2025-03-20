#!/bin/bash

set -e

export USAGE="USAGE: $0 MINT_IMAGE TASK"

if [ "$#" -ne 2 ]; then
    echo $USAGE
    exit 2
fi

export LAUNCH_MINT_CONTAINER="podman run --rm -it --events-backend=file --hostname=mint --network host -v $PWD:/srv:z $1"

if [ "$2" == "shell" ]; then
    $LAUNCH_MINT_CONTAINER /bin/bash
else
    $LAUNCH_MINT_CONTAINER /srv/scripts/launch.sh $1
fi

exit 0
