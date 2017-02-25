---
layout: post
permalink: how-to-reduce-memory-access-latency
comments: true
title: "How to reduce memory access latency"
date: 2017-02-24 22:35:00
description: Discuss about memory access latency and how to reduce it in C++
font-awesome: clock-o
categories:
- c++
- cache
- memory
- latency
---

**Random Access Memory Latency** refers to the delay that occurs in data transmission as data moves between computer RAM and the processor. RAM latency describes the amount of time it takes for the processor to retrieve data that is present somewhere in the RAM. It takes more time to fetch data from RAM than it takes to retrieve it from cache memory.

> **Latency** and **throughput** might appear to be positively correlated concepts, but they're literally fighting each other in the computing world. Processor scheduling is typically worked out by balancing the latency versus throughput trade-off (though keep in mind they're technically orthogonal concepts). The difference between the two terms are pretty much the foundation of building low-latency systems.

- **Do as little work as possible at run-time.**
    - In C, use macros/pre-processor directives. In C++, [template meta-programming](https://www.codeproject.com/Articles/3743/A-gentle-introduction-to-Template-Metaprogramming) is common.
    - Prefer [CRTP(Curiously Recurring Template Pattern) over dynamic polymorphism](http://stackoverflow.com/questions/262254/crtp-to-avoid-dynamic-polymorphism) whenever possible.
    - Avoid function pointers unless you're working them through templates to maximize inlining.
    - Use [expression templates](https://en.wikibooks.org/wiki/More_C%2B%2B_Idioms/Expression-template) to build your structures for computation whenever possible.

- **Take advantage of your cache.** The difference between the cache levels and memory are orders of magnitudes. You want your program to be cache-ready whenever possible.
    - Prefer contiguous blocks of memory over spread memory (similar to prefer to vectors vs linked lists). This also means **prefer vectors over unordered_maps/maps/sets/unordered_sets on small data sets**. The hash/binary traversal can very easily surpass the cache access of vectors. This means that **O(N)** can very often exceed the speed of **O(1)** or **O(log N)** on small sets. I see people abusing sets and unordered_sets a lot, but many at times, searching a vector linearly is significantly faster than constant or logarithmic time due to the cache.
    - Whenever possible, try to adapt your data structures and order of computations in a way that allows maximum use of the cache.
    ```c++
    // Cache-friendly version - processes pixels which are adjacent in memory
    for (unsigned int y = 0; y < height; ++y)
    {
            for (unsigned int x = 0; x < width; ++x)
            {
                ... image[y][x] ...
            }
    }
    // Cache-unfriendly version - jumps around in memory for no good reason
    for (unsigned int x = 0; x < width; ++y)
    {
            for(unsigned int y = 0; y < height; ++y)
            {
                ... image[y][x] ...
            }
    }
    // if you have to do many vertical scans, often it's better to rotate the
    // image of 90 degrees first and perform the various analysis later,
    // limiting the cache-unfriendly code just to the rotation.
    ```
    - Use cache-friendly algorithms, e.g. quick sort (changes the array in-place).

- **Prefer undefined behavior over safety where appropriate**. Safety checks can be very expensive when you're pushing into the sub-microsecond level.

- **Avoid any memory allocations whenever possible.** There should be a very limited number of allocations. If anything, learn to use arenas/[memory pools](https://www.codeproject.com/Articles/27487/Why-to-use-memory-pool-and-how-to-implement-it) with placement new. This avoids the overhead of having to allocate memory without needing to rewrite malloc yourself. Avoid shared_ptrs unless you absolutely need them. The reference counter can cause a lot of latency if not used extremely carefully.

- **Work with an entirely systematic approach.** Do not ever assume what most C++ developers assume. A huge one is RVO(Return Value Optimization)/NRVO(Named Return Value Optimization). You don't want your compiler determining when your string (or other object) is copied without you knowing. Disassemble your code and make sure your hypothesis is correct. Be explicit and work with move operations and references whenever you can.

- **Take note of struct padding.** The difference between swapping the order of a large data type and a small one can be massive because of [alignment requirements](http://www.catb.org/esr/structure-packing/#_alignment_requirements).
> Storage for the basic C datatypes on an x86 or ARM processor doesn’t normally start at arbitrary byte addresses in memory. Rather, each type except char has an alignment requirement; chars can start on any byte address, but 2-byte shorts must start on an even address, 4-byte ints or floats must start on an address divisible by 4, and 8-byte longs or doubles must start on an address divisible by 8. Signed or unsigned makes no difference.

    ```c++
    struct foo0 {
        short x;      /* 2 bytes */
        char c;       /* 1 byte + 1 byte padding */
    };

    struct foo1 {
        char *p;      /* 8 bytes */
        short x;      /* 2 bytes */
        char c;       /* 1 byte + 5 bytes padding */
    };

    struct foo2 {
        char c1;      /* 1 byte */
        char c3;      /* 1 byte + 6 bytes padding */
        char *p;      /* 8 bytes */
        long x;       /* 8 bytes */
    };
    ```
    In many cases, the compiler will not optimize this for you. You should always be wary about the order of how you declare your structs/classes. The simplest way to eliminate slop is to reorder the structure members by decreasing alignment. That is: make all the pointer-aligned subfields come first, because on a 64-bit machine they will be 8 bytes. Then the 4-byte ints; then the 2-byte shorts; then the character fields.
    > While reordering by size is the simplest way to eliminate slop, it’s not necessarily the right thing. There are two more issues: readability and cache locality.

    > The things you should do to preserve readability - grouping related and co-accessed data in adjacent fields - also improve cache-line locality. These are both reasons to reorder intelligently, with awareness of your code’s data-access patterns.

    You should also need to keep in mind [false sharing](https://en.wikipedia.org/wiki/False_sharing) if you're working in a multi-threaded environment. This occurs when each individual processor is attempting to use data in another memory region and attempts to store it in the same cache line. This causes the *cache line* -- which contains data another processor can use -- to be overwritten again and again. Effectively, different threads make each other wait by inducing cache misses in this situation. In C++11, developers can use [alignas](http://en.cppreference.com/w/cpp/language/alignas) to pad structs:
    ```c++
    // every object of type sse_t will be aligned to 16-byte boundary
    struct alignas(16) sse_t
    {
      float sse_data[4];
    };

    // the array "cacheline" will be aligned to 128-byte boundary
    alignas(128) char cacheline[128];
    ```

- **Take note of your switch statements.** If your cases are very far apart without much pattern, there's a chance it's not going to run through a normal [jump table](https://en.wikipedia.org/wiki/Branch_table). This means two things: (1.) take note of the order of your case statements and (2.) try to minimize the indices of the cases if at all possible. Don't go around enumerating A = 0, B = 1, C = 20, D = 500, E = 9999 if you can avoid it you should plan on throwing it into a case.

- **Avoid unpredictable branches and table lookups.**
    - Modern architectures feature pipelines and compilers are becoming very good at reordering code to minimize delays due to memory access. When your critical code contains (unpredictable) branches, it is hard or impossible to prefetch data. This will indirectly lead to more cache misses.
    - In the context of c++, `virtual` methods represent a controversial issue with regard to cache misses (a general consensus exists that they should be avoided when possible in terms of performance). Virtual functions can induce cache misses during look up, but this only happens if the specific function is not called often (otherwise it would likely be cached), so this is regarded as a non-issue by some. For reference about this issue, check out: [What is the performance cost of having a virtual method in a C++ class?](http://stackoverflow.com/questions/667634/what-is-the-performance-cost-of-having-a-virtual-method-in-a-c-class)

**Read More**
* [How does one become a low latency programmer?](https://www.quora.com/How-does-one-become-a-low-latency-programmer)
* [What is “cache-friendly” code?](http://stackoverflow.com/questions/16699247/what-is-cache-friendly-code)
* [The Lost Art of C Structure Packing](http://www.catb.org/esr/structure-packing/#_padding)
* [Memory Access Granularity](http://www.ibm.com/developerworks/library/pa-dalign/)
