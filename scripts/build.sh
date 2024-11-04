#!/bin/bash

set -e

export WORKSPACE=$PWD
export PACKAGE_NAME="palm-$VERSION_CODENAME-$GIT_VERSION"
export TARGET_DIR=$WORKSPACE/tmp

function build_dashboard_v4() {
    local react_node_modules="node_modules-$2.tar.xz"
    if [ ! -f $TARGET_DIR/$react_node_modules ]; then
        echo "couldn't find $react_node_modules_tar"
        exit 1
    fi

    cd $TARGET_DIR/mint-$1/dashboard-v4/dashboard/
    echo "uncompress node_modules dashboard-v4"
    tar xf $TARGET_DIR/$react_node_modules
    npm run build
}

# -----------------------------------------------------------------------------
if [ "$#" -ne 2 ]; then
    echo "USAGE: $0 FULL_GIT_COMMIT_ID ENV_ID"
    exit 1
fi

if [ ! -f $TARGET_DIR/$1.zip ]; then
    echo "download $1.zip from github"
    wget -q -P $TARGET_DIR https://github.com/iapt-platform/mint/archive/$1.zip
fi

if [ ! -f $TARGET_DIR/$2.env ]; then
    echo "couldn't find config file $TARGET_DIR/$2"
    exit 1
fi

# export $(grep -v '^#' $TARGET_DIR/$2.env | xargs -0)
source $TARGET_DIR/$2.env

# -----------------------------------------------------------------------------

cd $TARGET_DIR/
if [ -d mint-$1 ]; then
    echo "remove mint-$1 folder"
    rm -r mint-$1
fi
echo "uncompress $1.zip"
unzip -q $1.zip

build_dashboard_v4 $1 "20241028144559"

echo "done."
exit 0
