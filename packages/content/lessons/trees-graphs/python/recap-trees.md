Put the tree lessons together: a **binary search tree** built by inserting, read **level by level** with a queue and walked **depth-first** with recursion

---

A quick reminder of the pieces

- **Insert** into a binary search tree: smaller values go left, larger go right, and the new node goes where the path runs out
- **Level by level**: a queue, from **collections.deque**. Take a node from the front, put its children at the back, and count **len(queue)** at the start of each level
- **Depth-first**: a recursive function that does nothing on **None** and calls itself on the two children
- A **leaf** has no children; read in a depth-first walk, the leaves come out from left to right
- **Searching** a binary search tree follows one path from the root, left or right at every node

---

## Mission: Map a Search Tree

1. Write the class **Node**, with a value, a left child and a right child
2. Start your program with two variables: **values**, a list of whole numbers, and **target**, one of those numbers. For example `values = [50, 30, 70, 20, 40, 80]` and `target = 40`
3. Starting from an empty tree, insert the values into a binary search tree one at a time, in the order of the list
4. Print the tree level by level, using a queue: one line per level, with **Level**, the level's number, a colon, and the level's values from left to right
5. Print **Leaves:** and the leaves from left to right, found with a recursive walk
6. Print **Path to**, the target, a colon, and the values on the way from the root down to the target, the root and the target included

**values** holds from 1 to 7 numbers, all different, each from -1000 to 1000, and **target** is always one of them

**Example** for values = [50, 30, 70, 20, 40, 80] and target = 40

```text
Level 0: 50
Level 1: 30 70
Level 2: 20 40 80
Leaves: 20 40 80
Path to 40: 50 30 40
```

**Example** for values = [30, 10, 40, 20, 35] and target = 20

```text
Level 0: 30
Level 1: 10 40
Level 2: 20 35
Leaves: 20 35
Path to 20: 30 10 20
```

**Example** for values = [7] and target = 7

```text
Level 0: 7
Leaves: 7
Path to 7: 7
```
