Read a binary tree and print `true` if it is a binary search tree, `false` if not. An empty tree is one.

### How a tree is written

A tree comes on one line, read level by level and left to right. After a node come two places for its children, left first, and a child that isn't there is written `null`. The `null`s at the very end are left out, and an empty tree is just `null`.

```
        8
      /   \
     4     11
    /     /  \
   2     9    15
```

This tree is written `8 4 11 2 null 9 15`: first `8`, then its children `4` and `11`, then the children of `4` (`2` and none), then those of `11` (`9` and `15`). The children of `2`, `9` and `15` would all be `null` at the end, so they are left out.

In a **binary search tree** every value in a node's left subtree is smaller than the node's own value, every value in its right subtree is larger, and no two values are equal. The tree above is one.

The starter code already reads the input and builds the tree out of `Node`s with `value`, `left` and `right`, then prints `true` or `false` by what `is_valid_bst` returns. You write `is_valid_bst`.

### Input

- Line 1: the tree, written as above. The tree has at most 500 nodes, each value between -10^4 and 10^4. Values may repeat.

### Output

`true` if the tree is a binary search tree, `false` otherwise.

### Examples

```
Input:
8 4 11 2 null 9 15

Output:
true
```

```
Input:
8 4 11 2 9

Output:
false
```

`9` is the right child of `4`, so it is in the left subtree of `8`, yet larger than `8`.

```
Input:
5 5

Output:
false
```

Two equal values can't both be in a binary search tree.

```
Input:
null

Output:
true
```

An empty tree is a binary search tree.
