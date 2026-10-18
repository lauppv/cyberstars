A tree's **depth** is how many nodes its longest path from the root down to a leaf has. Read a binary tree and print its depth. An empty tree has depth 0.

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

The hidden part of the program already reads the input and builds the tree out of `struct Node`s with `value`, `left` and `right`, then prints what `max_depth` returns. You write `max_depth`.

### Input

- Line 1: the tree, written as above. The tree has at most 500 nodes, each value between -10^4 and 10^4.

### Output

One integer: the depth of the tree.

### Examples

```
Input:
8 4 11 2 null 9 15

Output:
3
```

```
Input:
5 null 7 null 9

Output:
3
```

The tree is one branch going right: `5`, then `7`, then `9`, so three nodes deep.

```
Input:
42

Output:
1
```

A lone root is one node deep.

```
Input:
null

Output:
0
```

An empty tree has no nodes at all.
