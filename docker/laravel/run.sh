#!/bin/sh
podman run --rm -it --events-backend=file --hostname=palm --network host -v $(dirname $PWD):/workspace:z mint-laravel
