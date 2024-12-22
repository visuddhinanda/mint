#include "coconut/application.hpp"

#include <spdlog/spdlog.h>
#include <args.hxx>

coconut::Application::Application(int argc, char** argv) {
    spdlog::info("hello coconut!");
}
