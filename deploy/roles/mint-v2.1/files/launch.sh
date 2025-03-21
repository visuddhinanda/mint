#!/bin/bash

set -e

export USAGE="USAGE: $0 COMMAND"

if [ "$#" -lt 1 ]; then
    echo $USAGE
    exit 1
fi

export WORK_DIR="/srv"

export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"

if [ "$1" == "setup" ]; then
    cd $WORK_DIR/api-v8/
    echo "install v2 laravel vendors"
    composer update --optimize-autoloader --no-dev
    echo "install v2 nodejs packages"
    npm install --production

    cd $WORK_DIR/api-v8/public/
    echo "install v1 vendors"
    composer update --optimize-autoloader --no-dev
    echo "install v1 nodejs packages"
    npm install --production
else
    $@
fi

exit 0
