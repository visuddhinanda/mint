#!/bin/bash

set -e

export VERSION=$(date "+%4Y%m%d%H%M%S")
export CODE="mint-spring"

podman pull ubuntu:latest
podman build -t $CODE .
# podman save --format=oci-archive -o $CODE-$VERSION.tar $CODE
# md5sum $CODE-$VERSION.tar >$CODE-$VERSION.md5

echo "done($CODE-$VERSION.tar)."

exit 0
