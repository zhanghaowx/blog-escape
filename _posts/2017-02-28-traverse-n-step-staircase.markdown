---
layout: post
permalink: traverse-n-step-staircase
comments: true
title: "Find the number of possible ways one can traverse a n-step staircase"
date: 2017-02-28 22:55:00
description: Coding Interview Practice
font-awesome: code
categories:
- c++
- algorithm
---
**Problem:** Find the number of possible ways one can traverse a n-step staircase (moving in one direction only) using any combination of 1-step, 2-step, and 3-step jumps.

**Solution**:

```c++
// recursive
int count(int n) {
  if (n == 0) {
    return 1;
  }

  if (n <= 2) {
    return n;
  }

  return count(n - 3) + count(n - 2) + count(n - 1);
}
```
```c++
// dynamic programming
if (n == 0) {
  return 1;
}

if (n <= 2) {
  return n;
}

int a = 1;
int b = 1;
int c = 2;
int d = a + b + c;
for (int i = 3; i < n; i++) {
  a = b;
  b = c;
  c = d;
  d = a + b + c;
}

return d;
```
```c++
// template meta-programming
template<int N>
struct count {
  static const int value = count<N-3>::value + count<N-2>::value + count<N-1>::value;
};

template<>
struct count<0> {
  static const int value = 1;
};

template<>
struct count<1> {
  static const int value = 1;
};

template<>
struct count<2> {
  static const int value = 2;
};
```
