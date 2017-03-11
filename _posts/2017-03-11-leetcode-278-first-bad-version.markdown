---
layout: post
permalink: leetcode-278-first-bad-version
comments: true
title: "First Bad Version"
date: 2017-03-11 20:40:00
description: Coding Interview Practice
font-awesome: code
categories:
- c++
- algorithm
- leetcode
- facebook
---

**Problem**:
You are a product manager and currently leading a team to develop a new product. Unfortunately, the latest version of your product fails the quality check. Since each version is developed based on the previous version, all the versions after a bad version are also bad.

Suppose you have `n` versions `[1, 2, ..., n]` and you want to find out the first bad one, which causes all the following ones to be bad.

You are given an API `bool isBadVersion(version)` which will return whether `version` is bad. Implement a function to find the first bad version. You should minimize the number of calls to the API.

**Solution**:
Although input has type `int`, computing `middle = (left + right) / 2` may still cause integer overflow. Use `long` to avoid the problem.
```c++
// Forward declaration of isBadVersion API.
bool isBadVersion(int version);

class Solution {
public:
    int firstBadVersion(int n) {
        return firstBadVersion(1, n);
    }

    int firstBadVersion(int left, int right) {
        int middle = ((long)left + right) / 2;

        if (isFirstBadVersion(middle)) {
            return middle;
        } else if (isBadVersion(middle)) {
            return firstBadVersion(left, middle - 1);
        }
        return firstBadVersion(middle + 1, right);
    }

    bool isFirstBadVersion(int i) {
        if (isBadVersion(i)) {
            if (i > 1) {
                return !isBadVersion(i - 1);
            }
            // first version if bad version
            return true;
        }

        return false;
    }
};
```
