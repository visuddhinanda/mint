#!/bin/bash

ssh -p 22 -L 3000:localhost:3000 $1

export USAGE="$0 SSH_USER SSH_HOST SSH_PORT frontend|backend"

if [ "$#" -ne 4 ]; then
    echo $USAGE
    exit 1
fi

if [[ "$4" == "backend" ]]
then
    ssh -p $3 -L 8000:localhost:8000 $1@$2
elif [[ "$1" == "frontend" ]]
then
    ssh -p $3 -L 3000:localhost:3000 $1@$2
else
    echo $USAGE
    exit 1
fi
