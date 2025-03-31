# Usage

## Podman setup

```bash
# For Ubuntu
sudo apt install crun podman buildah fuse-overlayfs
# For ArchLinux
sudo pacman -S crun podman buildah fuse-overlayfs
```

- Merge file `~/.config/containers/storage.conf` and `~/.config/containers/registries.conf`

- Disable build cache `podman build --no-cache NAME`

## Podman commands

```bash
podman image prune # removes all dangling images
podman system reset # clean
podman images # show images
podman ps -a # show containers
# https://docs.podman.io/en/stable/markdown/podman.1.html#tmpdir-path
TMPDIR=$HOME/tmp podman load -i images/mint-CODE-TIMESTAMP.tar.xz # import image
```
