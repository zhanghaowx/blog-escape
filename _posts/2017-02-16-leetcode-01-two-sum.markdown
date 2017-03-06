---
layout: post
permalink: leetcode-01-two-sum
comments: true
title: "LeetCode - 1.Two Sum"
date: 2017-02-16 22:49:32
description: Coding Interview Practice
font-awesome: code
categories:
- leetcode
- algorithm
- interview
---

Given an array of integers, return **indices** of the two numbers such that they add up to a specific target.
You may assume that each input would have ***exactly*** one solution, and you may not use the same element twice.

**Example:**
```
Given nums = [2, 7, 11, 15], target = 9,

Because nums[0] + nums[1] = 2 + 7 = 9,
return [0, 1].
```

**Solution 1 (C++)**
```c++
/**
 * Brute-Force
 * Time Complexity: O(n2)
 */
class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        vector<int> result;

        for (int i = 0; i < nums.size(); i++) {
            for(int j = i + 1; j < nums.size(); j++) {
                if(nums[i] + nums[j] == target) {
                    result.push_back(i);
                    result.push_back(j);
                    return result;
                }
            }
        }

        return result;
    }
};
```
**Solution 2 (C++)**
```c++
/**
 * Use a map to store visited numbers. For each number in nums, find target - nums[i] in map.
 * Time Complexity: O(n)
 */
class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> map;

        for (int i = 0; i < nums.size(); i++) {
            auto it = map.find(target - nums[i]);
            if (it == map.end()) {
                map.emplace(nums[i], i);
            } else {
                return vector<int> { it->second, i };
            }
        }

        return vector<int> {};
    }
};
```
