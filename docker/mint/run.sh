#!/bin/bash

set -e

export USAGE="USAGE: $0 MINT_IMAGE COMMAND"

if [[ "$#" -lt 2 ]]; then
    echo $USAGE
    exit 2
fi

export LAUNCH_MINT_CONTAINER="podman run --rm -it --events-backend=file --hostname=mint --network host -v $PWD:/srv:z $1"

if [ "$2" == "shell" ]; then
    $LAUNCH_MINT_CONTAINER /bin/bash
else
    $LAUNCH_MINT_CONTAINER /bin/bash -lc "/srv/scripts/launch.sh $2"
fi

exit 0
