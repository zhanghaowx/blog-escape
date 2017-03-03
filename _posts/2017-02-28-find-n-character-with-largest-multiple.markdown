---
layout: post
permalink: find-n-character-with-largest-multiple
comments: true
title: "Find N Character Substring That Has the Largest Multiple"
date: 2017-02-28 22:47:00
description: Coding Interview Practice
font-awesome: code
categories:
- c++
- algorithm
---
Given a very **long** string composed of numbers as characters, find the four character substring that has the largest multiple. For example, given the string "809723", the two char substring with the largest multiple is "97", having a multiple 9*7 = 63.

**Solution**

```c++
int computeMultiplies(const std::string& s, int left, int right) {
    if (left > right || right >= s.length()) {
        return 0;
    }

    int multiplies = 1;
    for (int i = left; i <= right; i++) {
        multiplies *= s[i] - '0';

        if (multiplies == 0) {
            break;
        }
    }

    return multiplies;

}

int findLargestMultiplies(const std::string& s, size_t substr_len) {
    if (s.length() == 0) {
        return -1;
    }

    // defines the substring
    int left = 0;
    int right = 0;

    int maxIndex = -1;
    int maxValue = -1;
    while (left <= right && right < s.length()) {
        if (right - left + 1 < substr_len) {
            right++;
            continue;
        }

        int multiplies = computeMultiplies(s, left, right);
        if (multiplies > maxValue) {
            maxValue = multiplies;
            maxIndex = left;
        }

        right++;
        left++;
    }

    return maxIndex;
}
```

Given input string are **long**, and length of substring are relatively small, we can use a map to cache result of multiplies

**Read**
[Find the substring with the largest multiple in a string of digits](https://interviewcodingpractices.blogspot.com/2016/05/find-substring-with-largest-multiple-in.html)
