---
layout: post
permalink: cplusplus-11-move-semantics-learning-notes
comments: true
title: "C++11 Move Semantics Learning Notes"
date: 2017-02-25 18:51:00
description: A summary of C++ 11 new features
font-awesome: code
categories:
- c++
---

**Rvalue References, Move Semantics, and Perfect Forwarding**
>C++11 has introduced the concept of rvalue references (specified with &&) to differentiate a reference to an lvalue or an rvalue. ***An lvalue is an object that has a name, while an rvalue is an object that does not have a name (a temporary object)***. The move semantics allow modifying rvalues (previously considered immutable and indistinguishable from const T& types).

* **Move semantics** makes it possible for compilers to replace expensive copying operations with less expensive moves. In the same way that copy constructors and copy assignment operators give you control over what it means to copy objects, move constructors and move assignment operators offer control over the semantics of moving. Move semantics also enables the creation of move-only types, such as `std::unique_ptr`, `std::future`, and `std::thread`.
* **Perfect forwarding** makes it possible to write function templates that take arbitrary arguments and forward them to other functions such that the target functions receive exactly the same arguments as were passed to the forwarding functions.

**`std::move` and `std::forward`**

> `std::move` doesn’t move anything. `std::forward` doesn’t forward anything. At runtime, neither does anything at all. They generate no executable code.

- `std::move` performs an unconditional cast to an rvalue. In and of itself, it doesn’t move anything.
- `std::forward` casts its argument to an rvalue only if that argument is bound to an rvalue.

> Rvalue references allow a function to branch at compile time (via overload resolution) on the condition "Am I being called on an lvalue or an rvalue?"

```c++
#include <iostream>
using namespace std;

class A {
public:
    A() {
        cout << "A is constructed" << endl;
    }
    ~A() {
        cout << "A is destroyed" << endl;
    }
};

void foo(const A& a) {
    cout << "called with lvalue" << endl;
}

void foo(A&& i) {
    cout << "called with rvalue" << endl;
}

/*
 * A is constructed
 * ---
 * called with lvalue
 * called with rvalue
 * ---
 * A is destroyed
*/
int main() {
    A a;

    cout << "---" << endl;

    foo(a);
    foo(std::move(a));

    cout << "---" << endl;

    return 0;
}
```

> Things that are declared as (has type as) rvalue reference can be **lvalues** or **rvalues**. The distinguishing criterion is: if it has a name, then it is an lvalue. Otherwise, it is an rvalue.

Let X be a class for which we have overloaded the copy constructor and copy assignment operator to implement move semantics

```c++
// Example.1 calls X(X const & rhs)
void foo(X&& x)
{
  X anotherX = x;
}

// Example.2 calls X(X&& rhs) because the thing on the right hand side has no name
// let goo be X&& goo();
X x = goo();
```

And here's the rationale behind the design: Allowing move sematics to be applied tacitly to something that has a name, as in

```c++
X anotherX = x;
// x is still in scope!
```
would be dangerously confusing and error-prone because the thing from which we just moved, that is, the thing that we just pilfered, is still accessible on subsequent lines of code. But the whole point of move semantics was to apply it only where it "doesn't matter," in the sense that the thing from which we move dies and goes away right after the moving. Hence the rule, ***"If it has a name, then it's an lvalue."***

**Move Semantics and Compiler Optimizations**
```c++
X foo()
{
  X x;
  // perhaps do something to x
  return x;
}
X foo()
{
  X x;
  // perhaps do something to x
  return std::move(x); // making it worse!
}
```
Any modern compiler will apply ***return value optimization*** to the original function definition. In other words, rather than constructing an X locally and then copying it out, the compiler would construct the X object directly at the location of foo's return value. Rather obviously, that's even better than move semantics.

> **Perfect forwarding** allows us to preserve an argument’s value category (**lvalue**/**rvalue**) and **const**/**volatile** modifiers. Perfect forwarding is performed in two steps: receive a forwarding reference (also known as universal reference), then forward it using std::forward.

```c++
#include <utility>
template<typename T, typename U>
std::pair<T, U> make_pair_wrapper(T&& t, U&& u)
{
	return std::make_pair(std::forward<T>(t),
	                      std::forward<U>(u));
}
```
Here is an example where `std::forward` is used twice in an idiomatic way:
```c++
struct Y
{
  Y(){}
  Y(const Y &){ std::cout << "arg copied\n"; }
  Y(Y &&){ std::cout << "arg moved\n"; }
};

struct X
{
  template<typename A, typename B>
  X(A && a, B && b) :
    // retrieve the original value category from constructor call
    // and pass on to member variables
    a_{ std::forward<A>(a) },
    b_{ std::forward<B>(b) }
  {
  }

  Y a_;
  Y b_;
};

template<typename A, typename B>
X factory(A && a, B && b)
{
  // retrieve the original value category from the factory call
  // and pass on to X constructor
  return X(std::forward<A>(a), std::forward<B>(b));
}

int main()
{
  Y y;
  X two = factory(y, Y());
  // the first argument is a lvalue, eventually a_ will have the
  // copy constructor called
  // the second argument is an rvalue, eventually b_ will have the
  // move constructor called
}

// prints
// arg copied
// arg moved
```

> `T&&` Doesn’t Always Mean “Rvalue Reference”

The essence of the issue is that `&&` in a type declaration sometimes means rvalue reference, but sometimes it means either rvalue reference or lvalue reference. As such, some occurrences of `&&` in source code may actually have the meaning of `&`, i.e., have the syntactic appearance of an rvalue reference (`&&`), but the meaning of an lvalue reference (`&`). Such unusually flexible references deserve their own name -- ***universal references***.

> If a variable or parameter is declared to have type T&& for some deduced type T, that variable or parameter is a universal reference.


**Benefits of Move Semantics**
* For those types that implement move semantics, many standard algorithms and operations will use move semantics and thus experience a potentially significant performance gain. An important example is inplace sorting: inplace sorting algorithms do hardly anything else but swap elements, and this swapping will now take advantage of move semantics for all types that provide it. (QuickSort)
* The STL often requires copyability of certain types, e.g., types that can be used as container elements. Upon close inspection, it turns out that in many cases, moveability is enough. Therefore, we can now use types that are moveable but not copyable (unique_pointer comes to mind) in many places where previously, they were not allowed. For example, these types can now be used as STL container elements.

**Use Case #1**

A C++ class/struct used to have some implicit member functions: default constructor (only if another constructor is not explicitly defined) and copy constructor, a destructor and a copy assignment operator. The copy constructor and the copy assignment operator perform a bit-wise (or shallow) copy, i.e. copying the variables bitwise. That means if you have a class that contains pointers to some objects, they just copy the value of the pointers and not the objects they point to. This might be OK in some cases, but for many cases you actually want a deep-copy, meaning that you want to copy the objects pointers refer to, and not the values of the pointers. In this case you have to explicitly write copy constructor and copy assignment operator to perform a deep-copy.

What if the object you initialize or copy from is an `rvalue` (a temporary). You still have to copy its value, but soon after the rvalue goes away. That means an overhead of operations, including allocations and memory copying that after all, should not be necessary.

Implement the move constructor and move assignment operator. These two special functions take a `T&&` argument, which is an rvalue. Knowing that fact, they can modify the object, such as "stealing" the objects their pointers refer to. For instance, a container implementation (such as a vector or a queue) may have a pointer to an array of elements. When an object is instantiating from a temporary, instead of allocating another array, copying the values from the temporary, and then deleting the memory from the temporary when that is destroyed, we just copy the value of the pointer that refers to the allocated array, thus saving an allocation, copying a sequence of elements, and a later de-allocation.

**Read**
* [Ten C++11 Features Every C++ Developer Should Use](https://www.codeproject.com/Articles/570638/Ten-Cplusplus-Features-Every-Cplusplus-Developer#lambdas)
* [The Biggest Changes in C++11 (and Why You Should Care)](http://blog.smartbear.com/c-plus-plus/the-biggest-changes-in-c11-and-why-you-should-care/)
* [C++ Rvalue References Explained](http://thbecker.net/articles/rvalue_references/section_01.html)
* [Universal References in C++11](https://isocpp.org/blog/2012/11/universal-references-in-c11-scott-meyers)
* [C++11 Rvalues and Move Semantics Confusion](http://stackoverflow.com/a/4986802/1661064)
