The **mirror** of a binary tree is the tree you see in a mirror held at its side: every node's left and right children trade places, all the way down. Read a binary tree and print its mirror, written the same way.

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

The hidden part of the program already reads the input and builds the tree out of `Node`s with `value`, `left` and `right`, then prints the tree `mirror` returns, written the same way. You write `mirror`: it can turn the tree around where it is or build a new one.

### Input

- Line 1: the tree, written as above. The tree has at most 500 nodes, each value between -10^4 and 10^4.

### Output

The mirrored tree on one line, written as above, with the `null`s at the end left out.

### Examples

```
Input:
8 4 11 2 null 9 15

Output:
8 11 4 15 9 null 2
```

In the mirror `11` comes before `4`, `15` before `9`, and `2` moves to the right of `4`:

```
        8
      /   \
    11     4
   /  \     \
  15   9     2
```

```
Input:
5 null 7 null 9

Output:
5 7 null 9
```

A branch going right becomes a branch going left.

```
Input:
null

Output:
null
```

The mirror of an empty tree is empty.
