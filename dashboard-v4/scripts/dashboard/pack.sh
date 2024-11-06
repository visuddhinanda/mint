#!/bin/sh

set -e

export VERSION=$(date "+%4Y%m%d%H%M%S")

XZ_OPT=-e9 tar -cJf dashboard-$VERSION.tar.xz node_modules yarn.lock

echo "done($VERSION)."

exit 0
