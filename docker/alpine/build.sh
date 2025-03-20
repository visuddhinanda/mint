#!/bin/bash

set -e

export VERSION=$(date "+%4Y%m%d%H%M%S")
export CODE="mint-alpine"
export TAR="$CODE-$(uname -m)"

podman pull alpine:latest
podman build -t $CODE .
podman save --format=oci-archive -o $TAR.tar $CODE
md5sum $TAR.tar >$TAR.md5

echo "done($TAR.tar)."

exit 0
