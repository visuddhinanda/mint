#include "coconut/application.hpp"

#include <spdlog/spdlog.h>
#include <args.hxx>
#include <grpcpp/grpcpp.h>
#include <google/protobuf/stubs/common.h>

coconut::Application::Application(int argc, char** argv) {
    spdlog::info("grpc({}), protobuf({})", grpc::Version(), google::protobuf::internal::VersionString(GOOGLE_PROTOBUF_VERSION));
    spdlog::info("hello coconut!");
}
