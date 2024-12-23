# USAGE

```bash
$ cd ~/workspace
$ ./iapt-platform/mint/docker/jammy/start.sh
# install dependencies
> add-apt-repository ppa:xmake-io/xmake
> apt install xmake libpq-dev

> cd /workspace/iapt-platform/mint
> cd coconut
# Debug
> xmake --root f -m debug
# Release for x86_64
> xmake f --root -p linux --toolchain=clang -a x86_64 -m release
# Release for aarch64
> xmake --root f -p linux --toolchain=clang -a arm64-v8a -m release

> xmake --root
> tree build
```

## Documents

- [Fast C++ logging library](https://github.com/gabime/spdlog)
- [A simple, small, flexible, single-header C++11 argument parsing library](https://github.com/Taywee/args)
- [A C++ library for communicating with a RabbitMQ message broker](https://github.com/CopernicaMarketingSoftware/AMQP-CPP)
- [JSON for Modern C++](https://github.com/nlohmann/json)
- [Lua](https://www.lua.org/manual/)
- [A C++ header-only HTTP/HTTPS server and client library](https://github.com/yhirose/cpp-httplib)
- [A basic tutorial introduction to gRPC in C++](https://grpc.io/docs/languages/cpp/basics/)
