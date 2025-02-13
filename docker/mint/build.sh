#!/bin/bash

set -e

# https://laravel.com/docs/master/releases
if [ "$#" -ne 1 ]; then
    echo "USAGE: $0 PHP_VERSION"
    exit 1
fi

export VERSION=$(date "+%4Y%m%d%H%M%S")
export CODE="mint-php$1"
export TAR="$CODE-$(uname -m)"

podman pull ubuntu:latest
podman build --build-arg PHP_VERSION=$1 -t $CODE .
podman save --format=oci-archive -o $TAR.tar $CODE
md5sum $TAR.tar >$TAR.md5

echo "done($TAR.tar)."

exit 0
