---
layout: post
permalink: partition-n-identical-objects
comments: true
title: "Partition N Identical Objects"
date: 2017-02-28 23:47:00
description: Coding Interview Practice
font-awesome: code
categories:
- c++
- algorithm
---

**Problem**: Given a set of N identical objects, write a function that returns the number of unique ways of partitioning the set.

**Solution 1**:
```C++
#include <iostream>
using namespace std;

int partition(int sum, int largestNumber){
    if (largestNumber==0)
        return 0;
    if (sum==0)
        return 1;
    if (sum<0)
        return 0;

    return partition(sum, largestNumber - 1)
    + partition(sum - largestNumber, largestNumber);
}

int partition(int sum) {
  return partition(sum, sum);
}

int main(){
    for (int i = 0; i < 100; i++) {
        cout << partition(i) << endl;
    }

    return 0;
}
```

**Solution 2**:
```c++
#include <iostream>
using namespace std;

int partition(int sum){
    int partitions[sum + 1][sum + 1] = {0};

    for (int i = 0; i <= sum; i++) {
        partitions[0][i] = 1;
        partitions[i][0] = 0;
    }

    for (int i = 1; i <= sum; i++) {
        for (int j = 1; j <= sum; j++) {
            if (j >= 1) {
                partitions[i][j] += partitions[i][j - 1];
            }
            if (i >= j) {
                partitions[i][j] += partitions[i - j][j];
            }
        }
    }

    return partitions[sum][sum];
}

int main(){
    for (int i = 0; i < 100; i++) {
        cout << partition(i) << endl;
    }

    return 0;
}
```
