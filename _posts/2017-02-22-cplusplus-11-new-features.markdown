---
layout: post
permalink: cplusplus-11-new-features
comments: true
title: "C++11 New Features"
date: 2017-02-22 21:41:00
description: A summary of C++ 11 new features
font-awesome: code
categories:
- c++
---

**Move Semantics**
C++11 has introduced the concept of rvalue references (specified with &&) to differentiate a reference to an lvalue or an rvalue. *An lvalue is an object that has a name, while an rvalue is an object that does not have a name (a temporary object)*. The move semantics allow modifying rvalues (previously considered immutable and indistinguishable from const T& types).

A C++ class/struct used to have some implicit member functions: default constructor (only if another constructor is not explicitly defined) and copy constructor, a destructor and a copy assignment operator. The copy constructor and the copy assignment operator perform a bit-wise (or shallow) copy, i.e. copying the variables bitwise. That means if you have a class that contains pointers to some objects, they just copy the value of the pointers and not the objects they point to. This might be OK in some cases, but for many cases you actually want a deep-copy, meaning that you want to copy the objects pointers refer to, and not the values of the pointers. In this case you have to explicitly write copy constructor and copy assignment operator to perform a deep-copy.

What if the object you initialize or copy from is an rvalue (a temporary). You still have to copy its value, but soon after the rvalue goes away. That means an overhead of operations, including allocations and memory copying that after all, should not be necessary.

Enter the move constructor and move assignment operator. These two special functions take a T&& argument, which is an rvalue. Knowing that fact, they can modify the object, such as "stealing" the objects their pointers refer to. For instance, a container implementation (such as a vector or a queue) may have a pointer to an array of elements. When an object is instantiating from a temporary, instead of allocating another array, copying the values from the temporary, and then deleting the memory from the temporary when that is destroyed, we just copy the value of the pointer that refers to the allocated array, thus saving an allocation, copying a sequence of elements, and a later de-allocation.


Read
* [Ten C++11 Features Every C++ Developer Should Use](https://www.codeproject.com/Articles/570638/Ten-Cplusplus-Features-Every-Cplusplus-Developer#lambdas)
* [C++14 Is Here: Summary of New Features](https://www.infoq.com/news/2014/08/cpp14-here-features)
* [The Biggest Changes in C++11 (and Why You Should Care)](http://blog.smartbear.com/c-plus-plus/the-biggest-changes-in-c11-and-why-you-should-care/)
