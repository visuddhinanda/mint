# USAGE

```bash
# Debug
xmake f -m debug

# Release for x86_64
xmake f -p linux --toolchain=clang -a x86_64 -m release
# Release for aarch64
xmake f -p linux --toolchain=clang -a arm64-v8a -m release
```
