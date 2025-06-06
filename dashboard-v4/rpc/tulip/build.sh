#!/bin/bash

set -e

export VERSION=$(date "+%4Y%m%d%H%M%S")
export CODE="mint-tulip"

buildah pull ubuntu:latest
buildah bud --layers -t $CODE .
podman save --format=oci-archive -o $CODE-$VERSION.tar $CODE
md5sum $CODE-$VERSION.tar > md5.txt

echo "done($CODE-$VERSION.tar)."

exit 0
