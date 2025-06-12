#!/bin/bash

set -e

export VERSION=$(date "+%4Y%m%d%H%M%S")
export CODE="mint-laravel"
export TAR="$CODE-$VERSION"

podman pull ubuntu:latest
podman build --build-arg PHP_VERSION=$1 -t $CODE .
podman save --format=oci-archive -o $TAR.tar $CODE
md5sum $TAR.tar >$TAR.md5

echo "done($TAR.tar)."

exit 0
