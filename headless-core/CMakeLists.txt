cmake_minimum_required(VERSION 3.16)
project(ShinobiHeadlessCore CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Find Vulkan driver capabilities natively (Jōgan Scanner)
find_package(Vulkan REQUIRED)

# Find native platform thread management
find_package(Threads REQUIRED)

add_executable(headless_engine main.cpp)

target_include_directories(headless_engine PRIVATE ${VULKAN_INCLUDE_DIRS})
target_link_libraries(headless_engine PRIVATE Vulkan::Vulkan Threads::Threads)

# Configure output flags for purely headless, display-free execution
if(UNIX)
    target_compile_definitions(headless_engine PRIVATE HEADLESS_LINUX=1)
elseif(WIN32)
    target_compile_definitions(headless_engine PRIVATE HEADLESS_WINDOWS=1)
endif()
