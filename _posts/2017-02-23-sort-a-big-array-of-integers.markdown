---
layout: post
permalink: sort-a-big-array-of-integers
comments: true
title: "Sort A Big Array of integers"
date: 2017-02-23 23:21:00
description: Find a way to sort big data structures
font-awesome: sort-numeric-asc
categories:
- c++
- sort
---

There are already studies on topics like [external sort](https://en.wikipedia.org/wiki/External_sorting) for handling large data. Today let's discuss a more specific problem:

```
Given an array of 10^9 numbers ranging from -2000 to 2000, how would you devise an algorithm to order the numbers.
```

If the 10^9 numbers are all integers, then unique integers in [-2000, 2000] are finite. We can use a map to help count all integers.

```c++
#include <iostream>
using namespace std;

// Needs a 64-bit machine
void sortArray(int* array, size_t length) {
    const int cMinNumber = -2000;
    const int cMaxNumber = 2000;
    const int cTotalNumbers = cMaxNumber - cMinNumber + 1;

    int* numbers = new int[cTotalNumbers] { 0 };

    for (size_t i = 0; i < length; i++) {
        numbers[array[i] - cMinNumber]++;
    }

    size_t index = 0;
    for (size_t i = 0; i < cTotalNumbers; i++) {
        const int& count = numbers[i];
        for (size_t j = 0; j < count; j++) {
            array[index++] = i + cMinNumber;
        }
    }
}
```

- **Time Complexity**: O(n + k), where n is size of input array and k is range of values in input array
- **Space Complexity**: O(k), where k is range of values in input array

The above algorithm is known as [counting sort](http://www.geeksforgeeks.org/counting-sort/)

**Read More**:
* [Radix Sort](http://www.geeksforgeeks.org/radix-sort/) uses counting sort as a subroutine to sort
* A more general solution: [How to sort a big array with many repetitions?](http://www.geeksforgeeks.org/how-to-sort-a-big-array-with-many-repetitions/)
