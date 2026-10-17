Put the tree lessons together: a **binary search tree** built by inserting, read **level by level** with a queue and walked **depth-first** with recursion

---

A quick reminder of the pieces

- **Insert** into a binary search tree: smaller values go left, larger go right, and the new node goes where the path runs out
- **Level by level**: a queue made of an array of `struct Node *` with a **head** and a **tail** index. Take a node from the front, put its children at the back, and count **tail - head** at the start of each level
- **Depth-first**: a recursive function that does nothing on **NULL** and calls itself on the two children
- A **leaf** has no children; read in a depth-first walk, the leaves come out from left to right
- **Searching** a binary search tree follows one path from the root, left or right at every node
- **Freeing** a whole tree is a postorder walk: the children first, then the node

---

## Mission: Map a Search Tree

1. Write the struct **Node**, with a value, a left child and a right child
2. Read the input with **scanf**: on the first line **n**, how many values there are, on the second line the **n** values, and on the third line a **target**, one of those values
3. Starting from an empty tree, insert the values into a binary search tree one at a time, in the order they were read
4. Print the tree level by level, using a queue: one line per level, with **Level**, the level's number, a colon, and the level's values from left to right
5. Print **Leaves:** and the leaves from left to right, found with a recursive walk
6. Print **Path to**, the target, a colon, and the values on the way from the root down to the target, the root and the target included
7. Free every node before **main** returns

**n** is from 1 to 7, the values are all different, each from -1000 to 1000, and the target is always one of them

**Example**

Input

```text
6
50 30 70 20 40 80
40
```

Output

```text
Level 0: 50
Level 1: 30 70
Level 2: 20 40 80
Leaves: 20 40 80
Path to 40: 50 30 40
```

**Example**

Input

```text
5
30 10 40 20 35
20
```

Output

```text
Level 0: 30
Level 1: 10 40
Level 2: 20 35
Leaves: 20 35
Path to 20: 30 10 20
```

**Example**

Input

```text
1
7
7
```

Output

```text
Level 0: 7
Leaves: 7
Path to 7: 7
```
