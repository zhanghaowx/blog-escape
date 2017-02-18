---
layout: post
permalink: add-two-numbers
comments: true
title: "LeetCode - 2.Add Two Numbers"
date: 2017-02-17 21:57:00
description: Coding Interview Practice
font-awesome: code
categories:
- leetcode
- algorithm
- interview
---

You are given two **non-empty** linked lists representing two non-negative integers. The digits are stored in reverse order and each of their nodes contain a single digit. Add the two numbers and return it as a linked list.

You may assume the two numbers do not contain any leading zero, except the number 0 itself.

**Input**: `(2 -> 4 -> 3) + (5 -> 6 -> 4)`

**Output**: `7 -> 0 -> 8`


```c++
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode(int x) : val(x), next(NULL) {}
 * };
 */
class Solution {
public:
    ListNode* addNode(ListNode* l1, ListNode* l2, int& carry) {
        int sum = carry;

        if (carry > 0) {
            carry--;
        }

        if (l1) {
            sum += l1->val;
        }

        if (l2) {
            sum += l2->val;
        }

        if (sum > 9) {
            sum = sum % 10;
            carry++;
        }

        return new ListNode(sum);
    }

    ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
        int carry = 0;

        ListNode* head = nullptr;
        ListNode* current = nullptr;

        while (l1 != nullptr || l2 != nullptr || carry != 0) {
            ListNode* nextNode = addNode(l1, l2, carry);

            if (current) {
                current->next = nextNode;
                current = current->next;
            } else {
                head = current = nextNode;
            }

            if (l1) {
                l1 = l1->next;
            }

            if (l2) {
                l2 = l2->next;
            }
        }

        return head;
    }
};
```
