---
layout: post
permalink: leetcode-05-longest-palindromic-substring
comments: true
title: "Longest Palindromic Substring"
date: 2017-03-05 19:05:00
description: Coding Interview Practice
font-awesome: code
categories:
- c++
- algorithm
- leetcode
---

**Problem**: Given a string s, find the longest palindromic substring in s. You may assume that the maximum length of s is 1000.

**Example**:

```
Input: "babad"

Output: "bab"
```

Note: "aba" is also a valid answer.

**Example**:

```
Input: "cbbd"

Output: "bb"
```

Initial thought: use two pointers **left** and **right** and two for-loops, iterate through all possible substrings and find out longest palindromic substring:

```c++
// Time Limit Exceeded Solution
class Solution {
public:
    bool isSubstrPalindrome(string s, int left, int right) {
        if (left > right) {
            return false;
        }

        while (left <= right) {
            if (s[left] != s[right]) {
                return false;
            }
            left++;
            right--;
        }

        return true;
    }

    string longestPalindrome(string s) {
        string palindrome = "";

        for (int left = 0; left < s.length(); left++) {
            int right = s.length() - 1;

            for (; right >= left; right--) {
                int substrLen = right - left + 1;
                if (substrLen <= palindrome.length()) {
                    break;
                } else if (isSubstrPalindrome(s, left, right)) {
                    palindrome = s.substr(left, substrLen);
                    break;
                }
            }

            if (right == s.length() - 1) {
                break;
            }
        }

        return palindrome;
    }
};
```

Time complexity of the above brute-force solution is O(n^3)


**Read**
[LeetCode Article: Longest Palindromic Substring](http://articles.leetcode.com/longest-palindromic-substring-part-i)
[ProgramCreek: Longest Palindromic Substring](http://www.programcreek.com/2013/12/leetcode-solution-of-longest-palindromic-substring-java/s)
