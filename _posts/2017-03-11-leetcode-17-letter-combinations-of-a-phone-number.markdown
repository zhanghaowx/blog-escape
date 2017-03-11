---
layout: post
permalink: leetcode-17-letter-combinations-of-a-phone-number
comments: true
title: "Letter Combinations of a Phone Number"
date: 2017-03-11 21:50:00
description: Coding Interview Practice
font-awesome: code
categories:
- c++
- algorithm
- leetcode
- amazon
- dropbox
- google
- uber
- facebook
---

**Problem**:
Given a digit string, return all possible letter combinations that the number could represent.

A mapping of digit to letters (just like on the telephone buttons) is given below.
![Telephone Keypad](https://upload.wikimedia.org/wikipedia/commons/7/73/Telephone-keypad2.svg)

```
Input:Digit string "23"
Output: ["ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"].
```
**Solution**:
Use a `queue` is the key.
```c++
class Solution {
public:
    vector<string> letterCombinations(string digits) {
        vector<string> result;

        if (digits.length() == 0) {
            return result;
        }

        queue<string> combinations;
        combinations.push("");

        const vector<string> digitToLetters = {"0", "1", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"};

        for (int i = 0; i < digits.size(); i++) {
            // count is number of strings from upper level with same length
            int count = combinations.size();
            for (int j = 0; j < count; j++) {

                const auto& front = combinations.front();
                const auto& letters = digitToLetters[digits[i] - '0'];

                for (int k = 0; k < letters.length(); k++) {
                    cout << front + letters[k] << endl;
                    if (i == digits.size() - 1) { // output as final string when reached last digit
                        result.push_back(front + letters[k]);
                    } else {
                        combinations.push(front + letters[k]);
                    }
                }

                combinations.pop();
            }
        }

        return result;
    }
};
```
