# USAGE

```bash
$ cd ~/workspace
$ ./iapt-platform/mint/docker/jammy/start.sh
> cd /workspace/iapt-platform/mint
> cd coconut

> apt update
> apt install libverto-dev libpq-dev

# debug mode
> xmake f -m debug
# release mode for x86_64
> xmake f -p linux --toolchain=clang -a x86_64 -m release
# release mode for aarch64
> xmake f -p linux --toolchain=clang -a arm64-v8a -m release

# build
> xmake
> tree build
```

## Documents

- [Fast C++ logging library](https://github.com/gabime/spdlog)
- [A simple, small, flexible, single-header C++11 argument parsing library](https://github.com/Taywee/args)
- [A C++ library for communicating with a RabbitMQ message broker](https://github.com/CopernicaMarketingSoftware/AMQP-CPP)
- [Header-only TOML config file parser and serializer for C++17](https://marzer.github.io/tomlplusplus/)
- [JSON for Modern C++](https://github.com/nlohmann/json)
- [Lua](https://www.lua.org/manual/)
- [A C++ header-only HTTP/HTTPS server and client library](https://github.com/yhirose/cpp-httplib)
- [A basic tutorial introduction to gRPC in C++](https://grpc.io/docs/languages/cpp/basics/)
