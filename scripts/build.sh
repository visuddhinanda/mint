#!/bin/bash

set -e

export WORKSPACE=$PWD
export PACKAGE_NAME="mint-$1"

function build_dashboard_v4() {
    local react_node_modules="dashboard-$1.tar.xz"
    if [ ! -f $WORKSPACE/downloads/$react_node_modules ]; then
        echo "couldn't find $react_node_modules_tar"
        exit 1
    fi

    cd $WORKSPACE/$PACKAGE_NAME/dashboard-v4/dashboard/
    echo "uncompress node_modules for dashboard-v4"
    tar xf $WORKSPACE/downloads/$react_node_modules
    yarn build

    cp -r build $WORKSPACE/$PACKAGE_NAME-dist/dashboard
}

# -----------------------------------------------------------------------------
if [ "$#" -ne 2 ]; then
    echo "USAGE: $0 FULL_GIT_COMMIT_ID ENV_ID"
    exit 1
fi

if [ ! -f $WORKSPACE/downloads/$1.zip ]; then
    echo "download $1.zip from github"
    mkdir -p $WORKSPACE/downloads
    wget -q -P $WORKSPACE/downloads https://github.com/iapt-platform/mint/archive/$1.zip
fi

if [ ! -f $WORKSPACE/$2.env ]; then
    echo "couldn't find config file $2.env"
    exit 1
fi

source $WORKSPACE/$2.env

# -----------------------------------------------------------------------------

if [ -d $WORKSPACE/$PACKAGE_NAME ]; then
    echo "remove $PACKAGE_NAME folder"
    rm -r $WORKSPACE/$PACKAGE_NAME
fi
echo "uncompress $1.zip"
unzip -d $WORKSPACE -q $WORKSPACE/downloads/$1.zip

# -----------------------------------------------------------------------------

if [ -d $WORKSPACE/$PACKAGE_NAME-dist ]; then
    rm -r $WORKSPACE/$PACKAGE_NAME-dist
fi

mkdir -p $WORKSPACE/$PACKAGE_NAME-dist

build_dashboard_v4 "20241106153131"

cd $WORKSPACE
cp -r $PACKAGE_NAME/api-v8 $PACKAGE_NAME-dist/htdocs

if [ -f $PACKAGE_NAME.tar.xz ]; then
    rm $PACKAGE_NAME.tar.xz
fi
XZ_OPT=-e9 tar -C $PACKAGE_NAME-dist -jcf $PACKAGE_NAME.tar.xz dashboard htdocs
md5sum $PACKAGE_NAME.tar.xz >$PACKAGE_NAME.md5

# -----------------------------------------------------------------------------

echo "done($PACKAGE_NAME.tar.xz)."
exit 0
