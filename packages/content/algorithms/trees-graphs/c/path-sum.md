A **leaf** is a node with no children. Read a binary tree and a number, and print `true` if some path from the root down to a leaf has values adding up to that number, `false` if none does. An empty tree has no paths at all.

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

The starter code already reads the input and builds the tree out of `struct Node`s with `value`, `left` and `right`, then prints `true` or `false` by what `has_path_sum` returns. You write `has_path_sum`.

### Input

- Line 1: the tree, written as above. The tree has at most 500 nodes, each value between -10^4 and 10^4.
- Line 2: the sum to look for, between -5·10^6 and 5·10^6.

### Output

`true` if a root-to-leaf path adds up to the sum, `false` otherwise.

### Examples

```
Input:
8 4 11 2 null 9 15
28

Output:
true
```

`8 + 11 + 9` is `28`, and `9` is a leaf.

```
Input:
8 4 11 2 null 9 15
12

Output:
false
```

`8 + 4` is `12`, but `4` isn't a leaf: the path has to go on to `2`, and then it adds up to `14`.

```
Input:
-2 null -3
-5

Output:
true
```

```
Input:
null
0

Output:
false
```

An empty tree has no path, not even one adding up to `0`.
