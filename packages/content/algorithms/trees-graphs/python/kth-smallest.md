Read a binary search tree and a number `k`, and print the `k`-th smallest value in the tree, counting from 1.

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

The hidden part of the program already reads the input and builds the tree out of `Node`s with `value`, `left` and `right`, then prints what `kth_smallest` returns. You write `kth_smallest`, which gets the root and `k`.

### Input

- Line 1: a binary search tree, written as above, with 1 to 500 nodes, each value between -10^4 and 10^4.
- Line 2: `k`, with `1 <= k <=` the number of nodes.

### Output

One integer: the `k`-th smallest value.

### Examples

```
Input:
8 4 11 2 null 9 15
3

Output:
8
```

In order the values are `2 4 8 9 11 15`, and the third is `8`.

```
Input:
8 4 11 2 null 9 15
1

Output:
2
```

```
Input:
20 10 30 null 15
2

Output:
15
```

The second smallest isn't always the parent of the smallest: here it is `15`, the right child of `10`.
