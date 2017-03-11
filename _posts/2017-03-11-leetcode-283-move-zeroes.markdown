---
layout: post
permalink: leetcode-281-move-zeroes
comments: true
title: "Move Zeroes"
date: 2017-03-11 14:22:22
description: Coding Interview Practice
font-awesome: code
categories:
- c++
- algorithm
- leetcode
- bloomberg
- facebook
---

**Problem**:
Given an array nums, write a function to move all `0`'s to the end of it while maintaining the relative order of the non-zero elements.
For example, given `nums = [0, 1, 0, 3, 12]`, after calling your function, `nums` should be `[1, 3, 12, 0, 0]`.

**Note**:
1. You must do this in-place without making a copy of the array.
2. Minimize the total number of operations.

**Solution**:

```c++
class Solution {
public:
    void moveZeroes(vector<int>& nums) {
        int nonZeroPtr = 0;
        for (int i = 0; i < nums.size(); i++) {
            if (nums[i] != 0) {
                nums[nonZeroPtr++] = nums[i];
            }
        }

        for (int j = nonZeroPtr; j < nums.size(); j++) {
            nums[j] = 0;
        }
    }
};
```
