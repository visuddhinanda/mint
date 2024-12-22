add_rules("mode.debug", "mode.release")
set_languages("c11", "c++20")

add_requires("spdlog", "taywee_args")

target("coconut")
    set_kind("binary")
    add_includedirs("include")
    add_files("src/*.cpp")
    add_packages("spdlog", "taywee_args")
