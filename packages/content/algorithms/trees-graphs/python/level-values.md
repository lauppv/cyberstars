Read a binary tree and print its values level by level: the root on the first line, its children on the second, their children on the third, and so on. Each line lists its level from left to right, separated by single spaces. An empty tree prints nothing.

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

The hidden part of the program already reads the input and builds the tree out of `Node`s with `value`, `left` and `right`, then calls `print_levels`. You write `print_levels`, which prints the levels.

### Input

- Line 1: the tree, written as above. The tree has at most 500 nodes, each value between -10^4 and 10^4.

### Output

One line per level, from the root down, each with its values from left to right.

### Examples

```
Input:
8 4 11 2 null 9 15

Output:
8
4 11
2 9 15
```

```
Input:
1 null 2 3

Output:
1
2
3
```

`2` is the right child of `1`, and `3` the left child of `2`: three levels of one value each.

```
Input:
7

Output:
7
```

A lone root is a single level.
