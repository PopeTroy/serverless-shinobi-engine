cmake_minimum_required(VERSION 3.16)
project(ShinobiHeadlessDirectX CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

find_package(Threads REQUIRED)

add_executable(headless_engine main.cpp)

target_link_libraries(headless_engine PRIVATE Threads::Threads)

if(WIN32)
    # Enforce strict Windows desktop environment definitions
    target_compile_definitions(headless_engine PRIVATE WIN32_LEAN_AND_MEAN=1)
endif()
