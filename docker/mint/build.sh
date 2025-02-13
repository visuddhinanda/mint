#!/bin/bash

set -e

# https://laravel.com/docs/master/releases
if [ "$#" -ne 1 ]; then
    echo "USAGE: $0 PHP_VERSION"
    exit 1
fi

export VERSION=$(date "+%4Y%m%d%H%M%S")
export CODE="mint-$(uname -m)-$1"

podman pull ubuntu:latest
podman build --build-arg PHP_VERSION=$1 -t $CODE .
podman save --format=oci-archive -o $CODE-$VERSION.tar $CODE
md5sum $CODE-$VERSION.tar >$CODE-$VERSION.md5

echo "done($CODE-$VERSION.tar)."

exit 0
