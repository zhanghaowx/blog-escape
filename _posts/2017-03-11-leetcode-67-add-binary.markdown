---
layout: post
permalink: leetcode-67-add binary
comments: true
title: "Add Binary"
date: 2017-03-11 17:03:00
description: Coding Interview Practice
font-awesome: code
categories:
- c++
- algorithm
- leetcode
- facebook
---
**Problem**:
Given two binary strings, return their sum (also a binary string).

For example, a = "11", b = "1", return "100".

**Solution**:
It is very similar to the implementation of a [BigInt]({% post_url 2017-02-26-fibonacci %}) class, but needs to pay extra attention to the least important bit which is at `length - 1`.
```c++
class Solution {
public:
    string addBinary(string a, string b) {
        string sum = "";

        int aPtr = a.length() - 1;
        int bPtr = b.length() - 1;
        int carry = 0;

        while(aPtr >= 0 || bPtr >= 0) {
            int aNum = 0;
            if (aPtr >= 0) {
                aNum = (int)a[aPtr--] - '0';
            }

            int bNum = 0;
            if (bPtr >= 0) {
                bNum = (int)b[bPtr--] - '0';
            }

            int plus = aNum + bNum + carry;

            sum = (plus % 2 ? '1' : '0') + sum;
            carry = plus / 2;
        }

        if (carry) {
            sum = (carry % 2 ? '1' : '0') + sum;
        }

        return sum;
    }
};
```
