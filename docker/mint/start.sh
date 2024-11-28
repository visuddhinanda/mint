#!/bin/bash

export CODE="mint"
export NAME="$CODE-$USER"

podman run --rm -it --events-backend=file --hostname=mint --network host -v $PWD:/workspace:z $CODE
