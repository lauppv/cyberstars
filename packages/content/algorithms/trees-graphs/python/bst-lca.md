An **ancestor** of a node is any node on the way from the root down to it, the node itself included. The **lowest common ancestor** of two nodes is the one of their shared ancestors that sits deepest. Read a binary search tree and two of its values, and print the value of their lowest common ancestor.

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

The starter code already reads the input and builds the tree out of `Node`s with `value`, `left` and `right`, then prints what `common_ancestor` returns. You write `common_ancestor`, which gets the root and the two values.

### Input

- Line 1: a binary search tree, written as above, with 2 to 500 nodes, each value between -10^4 and 10^4.
- Line 2: two different values `p` and `q`, both in the tree, separated by a space.

### Output

One integer: the value of the lowest common ancestor of `p` and `q`.

### Examples

```
Input:
8 4 11 2 null 9 15
2 9

Output:
8
```

`2` is on the left of `8` and `9` on its right, so the paths to them part at `8`.

```
Input:
8 4 11 2 null 9 15
15 9

Output:
11
```

```
Input:
8 4 11 2 null 9 15
4 2

Output:
4
```

`4` is an ancestor of `2` and of itself.
