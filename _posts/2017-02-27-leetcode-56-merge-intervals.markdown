---
layout: post
permalink: merge-intervals
comments: true
title: "LeetCode - 56.Merge Intervals"
date: 2017-02-27å 00:55:00
description: Coding Interview Practice
font-awesome: code
categories:
- leetcode
- algorithm
- interview
---

Given a collection of intervals, merge all overlapping intervals.

For example,
Given `[1,3],[2,6],[8,10],[15,18]`,
return `[1,6],[8,10],[15,18]`.

**Solution**
```c++
/**
 * Definition for an interval.
 * struct Interval {
 *     int start;
 *     int end;
 *     Interval() : start(0), end(0) {}
 *     Interval(int s, int e) : start(s), end(e) {}
 * };
 */
class Solution {
public:
    vector<Interval> merge(vector<Interval>& intervals) {
        std::sort(
            intervals.begin(),
            intervals.end(),
            [](const Interval& a, const Interval& b) {
                return a.start < b.start;
            });

        auto it = intervals.begin();
        while(it != intervals.end() && (it + 1) != intervals.end()) {
            if (merge(*it, *it, *(it + 1))) {
                intervals.erase(it + 1);
            } else {
                it++;
            }
        }

        return intervals;
    }

    bool merge(Interval& out, const Interval& one, const Interval& another) {
        if (one.start > another.end || another.start > one.end) {
            return false;
        }

        out.start = std::min(one.start, another.start);
        out.end = std::max(one.end, another.end);

        return true;
    }
};
```
