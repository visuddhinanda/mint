add_rules("mode.debug", "mode.release")
set_languages("c11", "c++20")

add_requires(
    "libpqxx", "redis-plus-plus", "amqp-cpp", 
    "nlohmann_json", "cpp-httplib", "grpc",
    "lua", "spdlog", "taywee_args"
)

target("coconut")
    set_kind("binary")
    add_includedirs("include")
    add_files("src/*.cpp")
    add_packages(
        "libpqxx", "redis-plus-plus", "amqp-cpp",
        "nlohmann_json", "cpp-httplib", 
        "abseil", "grpc",
        "lua", "spdlog", "taywee_args"
    )
