Two binary trees are **the same** when they have the same shape and the same value in every matching node. Read two trees and print `true` if they are the same, `false` if not. Two empty trees are the same.

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

The starter code already reads the input and builds both trees out of `Node`s with `value`, `left` and `right`, then prints `true` or `false` by what `same_tree` returns. You write `same_tree`.

### Input

- Line 1: the first tree, written as above.
- Line 2: the second tree, written the same way.
- Each tree has at most 500 nodes, each value between -10^4 and 10^4.

### Output

`true` if the two trees are the same, `false` otherwise.

### Examples

```
Input:
8 4 11 2 null 9 15
8 4 11 2 null 9 15

Output:
true
```

```
Input:
1 2
1 null 2

Output:
false
```

Both trees hold `1` and `2`, but in the first `2` is the left child and in the second it is the right one.

```
Input:
6 3 9
6 3 10

Output:
false
```

Same shape, but one pair of nodes holds different values.

```
Input:
null
null

Output:
true
```

Two empty trees are the same.
