---
layout: post
permalink: leetcode-03-longest-substring-without-repeating-characters
comments: true
title: "LeetCode - 3.Longest Substring Without Repeating Characters"
date: 2017-02-18 17:15:00
description: Coding Interview Practice
font-awesome: code
categories:
- leetcode
- algorithm
- interview
---

Given a string, find the length of the **longest substring** without repeating characters.

**Examples:**

Given `"abcabcbb"`, the answer is `"abc"`, which the length is 3.

Given `"bbbbb"`, the answer is `"b"`, with the length of 1.

Given `"pwwkew"`, the answer is `"wke"`, with the length of 3. Note that the answer must be a substring, `"pwke"` is a subsequence and not a substring.


**First Submission:**
```c++
class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        int* len = new int[s.length()];

        int start = 0;
        for (int i = 0; i < s.length(); i++) {
            int j = start;
            for (; j < i; j++) {
                if (s.at(i) == s.at(j)) {
                    break;
                }
            }

            if (j != i) {
                start = j + 1;
            }

            len[i] = i - start + 1;
        }

        int max = 0;
        for (int i = 0; i < s.length(); i++) {
            max = max > len[i] ? max : len[i];
        }

        delete[] len;

        return max;
    }
};
```
Notes:
1. Used a helper array `int* len = new int[s.length()];` to store intermediate results;
2. Find duplicate characters by brute force algorithm.

Improvements:
1. Remove the helper array;
2. Use a map to speed up finding duplicate characters.

```c++
class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        int characters[256] = {};
        fill_n(characters, 256, -1);

        int maxLen = 0;
        for (int substrBegin = 0, i = 0; i < s.length(); i++) {
            char ch = s.at(i);

            if (characters[ch] >= substrBegin) {
                substrBegin = characters[ch] + 1;
            }
            characters[ch] = i;

            maxLen = max(maxLen, i - substrBegin + 1);
        }

        return maxLen;
    }
};
```
**Complexity Analysis**
* Time complexity: O(n).
* Space complexity: O(1).

**Thoughts**
Use a `std::unordered_map` instead of `int[256]`

Pros
* Supports character set beyond ASCII.
* No need to initialize array with -1.

Cons
* Not cache friendly.
* Map is generally slower than array.

> Take advantage of your cache. The difference between the cache levels and memory are orders of magnitudes. You want your program to be cache-ready whenever possible. **Prefer contiguous blocks of memory over spread memory (similar to prefer to vectors vs linked lists).  This also means prefer vectors over unordered_maps/maps/sets/unordered_sets on small data sets.** The hash/binary traversal can very easily surpass the cache access of vectors. This means that O(N) can very often exceed the speed of O(1) or (log N) on small sets. I see people abusing sets and unordered_sets a lot, but many at times, searching a vector linearly is significantly faster than constant or logarithmic time due to the cache.

From [Quora](https://www.quora.com/C-C++-is-used-in-low-latency-systems-like-finance-for-its-speed-What-are-some-ways-expert-C++-developers-actually-get-this-speed-boost)


**Read** [Editorial Solution](https://leetcode.com/articles/longest-substring-without-repeating-characters/)
