---
layout: post
permalink: leetcode-325-maximun-size-subarray-sum-equals-k
comments: true
title: "Maximum Size Subarray Sum Equals k"
date: 2017-03-11 14:48:22
description: Coding Interview Practice
font-awesome: code
categories:
- c++
- algorithm
- leetcode
- palantir
- facebook
---

**Problem**:
Given an array nums and a target value k, find the maximum length of a subarray that sums to k. If there isn't one, return 0 instead.

**Note**:
The sum of the entire nums array is guaranteed to fit within the 32-bit signed integer range.

**Example 1**:
Given nums = `[1, -1, 5, -2, 3]`, k = `3`,
return `4`. (because the subarray [`1, -1, 5, -2]` sums to 3 and is the longest)

**Example 2**:
Given nums = `[-2, -1, 2, 1]`, k = `1`,
return `2`. (because the subarray `[-1, 2]` sums to 1 and is the longest)

**Follow Up**:
Can you do it in O(n) time?

**Solution**:

## Brute-force
```c++
class Solution {
public:
    int maxSubArrayLen(vector<int>& nums, int k) {
        int maxLen = 0;
        for (int i = 0; i < nums.size(); i++) {
            for (int j = i; j < nums.size(); j++) {
                if (sum(nums, i, j) == k) {
                    maxLen = std::max(j - i + 1, maxLen);
                }
            }
        }

        return maxLen;
    }

    int sum(vector<int>& nums, int i, int j) {
        int sum = 0;
        for (int k = i; k <= j; k++) {
            sum += nums[k];
        }
        return sum;
    }
};
```

## Optimize sum calculation
```c++
class Solution {
public:
    int maxSubArrayLen(vector<int>& nums, int k) {
        vector<int> sumHelper;

        int sum = 0;
        for (int i = 0; i < nums.size(); i++) {
            sum += nums[i];
            sumHelper.push_back(sum);
        }

        int maxLen = 0;
        for (int i = 0; i < nums.size(); i++) {
            for (int j = i; j < nums.size(); j++) {
                if (sumHelper[j] - sumHelper[i] + nums[i] == k) {
                    maxLen = std::max(j - i + 1, maxLen);
                }
            }
        }

        return maxLen;
    }
};
```
## O(n) Solution
Because we know the sum `k`, we could use a map to accelerate looking up just like a 2 sum problem.
```c++
class Solution {
public:
    int maxSubArrayLen(vector<int>& nums, int k) {
        /**
         * key: sum of numbers in [0, i]
         * value: index value i
         */
        unordered_map<int, int> sumHelper;

        int sum = 0;
        int maxLen = 0;
        for (int i = 0; i < nums.size(); i++) {
            sum += nums[i];

            // when sum - k is 0, subarray begins at 0
            if (sum == k) {
                maxLen = max(maxLen, i + 1);
            }

            // find the element before subarray (if exists)
            auto it = sumHelper.find(sum - k);
            if (it != sumHelper.end()) {
                int j = it->second;
                maxLen = max(maxLen, i - j);
            } else {
                sumHelper.emplace(sum, i);
            }

        }

        return maxLen;
    }
};
```
