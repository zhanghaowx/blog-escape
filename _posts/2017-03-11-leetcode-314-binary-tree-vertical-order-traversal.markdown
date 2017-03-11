---
layout: post
permalink: leetcode-314-binary-tree-vertical-order-traversal
comments: true
title: "Binary Tree Vertical Order Traversal"
date: 2017-03-11 19:00:00
description: Coding Interview Practice
font-awesome: code
categories:
- c++
- algorithm
- leetcode
- google
- snapchat
- facebook
---
**Problem**:
Given a binary tree, return the vertical order traversal of its nodes' values. (ie, from top to bottom, column by column).

If two nodes are in the same row and column, the order should be from *left to right*.

**Examples**:
1. Given binary tree [3,9,20,null,null,15,7],
    ```
       3
      /\
     /  \
     9  20
        /\
       /  \
      15   7
    ```
return its vertical order traversal as:
    ```
    [
      [9],
      [3,15],
      [20],
      [7]
    ]
    ```
2. Given binary tree [3,9,8,4,0,1,7],
    ```
         3
        /\
       /  \
       9   8
      /\  /\
     /  \/  \
     4  01   7

    ```
return its vertical order traversal as:
    ```
    [
      [4],
      [9],
      [3,0,1],
      [8],
      [7]
    ]
    ```
3. Given binary tree [3,9,8,4,0,1,7,null,null,null,2,5] (0's right child is 2 and 1's left child is 5),
    ```
         3
        /\
       /  \
       9   8
      /\  /\
     /  \/  \
     4  01   7
        /\
       /  \
       5   2
    ```
return its vertical order traversal as:
    ```
    [
      [4],
      [9,5],
      [3,0,1],
      [8,2],
      [7]
    ]
    ```

**Solution**:
Use BFS to guarantee order within column. If use DFS, order will be difficult to maintain.
```c++
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode(int x) : val(x), left(NULL), right(NULL) {}
 * };
 *
 * Must use BFS, DFS won't work.
 */
class Solution {
public:
    vector<vector<int>> verticalOrder(TreeNode* root) {
        vector<vector<int>> result;
        if (!root) {
            return result;
        }

        traverse(root, 0);

        for (int i = m_colMin; i <= m_colMax; i++) {
            auto it = m_colMap.find(i); // it guarantees to be not m_colMap.end()
            result.push_back(it->second);
        }

        return result;
    }

    /**
     * BFS traversal
     */
    void traverse(TreeNode* root, int col) {
        queue<pair<TreeNode*, int>> queue;
        queue.push(make_pair(root, 0));

        while (!queue.empty()) {
            const auto& front = queue.front();

            TreeNode* node = front.first;
            int col = front.second;
            visit(node, col);

            queue.pop();

            if (node->left) {
                queue.push(make_pair(node->left, col - 1));
            }

            if (node->right) {
                queue.push(make_pair(node->right, col + 1));
            }
        }
    }

    /**
     * Order all nodes by column
     */
    void visit(TreeNode* node, int col) {
        m_colMin = min(m_colMin, col);
        m_colMax = max(m_colMax, col);

        auto it = m_colMap.find(col);
        if (it == m_colMap.end()) {
            m_colMap.emplace(col, vector<int>{node->val});
        } else {
            it->second.push_back(node->val);
        }
    }
private:
    int m_colMin = 0;
    int m_colMax = 0;
    /**
     * key: col between [m_colMin, m_colMax]
     * value: node values from top to down
     */
    unordered_map<int, vector<int>> m_colMap;
};
```
