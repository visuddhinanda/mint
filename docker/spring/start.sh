#!/bin/bash

export CODE="mint-spring"
export NAME="$CODE-$USER"

export USAGE="USAGE: $0 services|frontend|backend|shell"
export PODMAN="podman run --rm -it --events-backend=file --hostname=mint --network host -v $PWD:/workspace:z $CODE"

if [ "$#" -ne 1 ]; then
    echo $USAGE
    exit 1
fi

if [[ "$1" == "services" ]]
then
    echo "start mint services"
elif [[ "$1" == "backend" ]]
then
    echo "start mint frontend services"
elif [[ "$1" == "frontend" ]]
then
    $PODMAN /usr/bin/zsh -c 'source $HOME/.zshrc && cd /workspace/dashboard-v4/dashboard && yarn start'
elif [[ "$1" == "shell" ]]
then
    $PODMAN /usr/bin/zsh -l
else
    echo $USAGE
fi

# if podman container exists $NAME; then
#     podman start -i -a $NAME
# else
#     podman run --name $NAME -it --events-backend=file --hostname=mint --network host -v $PWD:/workspace:z $CODE
# fi
