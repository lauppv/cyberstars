Lists keep things in a line: a first item, a second, a third. A lot of what you meet every day branches out instead. The folders on your computer hold more folders, which hold more folders. A family tree splits at every generation. A tournament bracket narrows down to one winner. All of these have the same shape, and it has a name: a **tree**

---

Here is a small tree of numbers

```visual
{"use": "trees-terms"}
```

Every number is a **node**, and every line between two nodes is an **edge**. Trees in programming grow upside down: they start at the top

- The **root** is the node at the top, where the tree starts: **8**
- A node right below another one is its **child**, and the one above is its **parent**. **3** and **10** are the children of **8**, and **8** is their parent
- A node with no children is a **leaf**: **1**, **6** and **14**
- The **height** of a tree is the number of edges on the longest way down from the root to a leaf. Here it's 8 → 3 → 1, or 8 → 10 → 14: two edges, so the height is **2**. A tree that is only a root has height **0**

Every node but the root has exactly one parent, so there is exactly one way down from the root to each node. That's what makes it a tree, and not just a tangle of lines

---

In this tree no node has more than two children. A tree like that is a **binary tree**, and its two children have names: the **left** child and the **right** child. **10** has only a right child, **14**; its left one is missing

Binary trees are the ones you'll use most. Searching, sorting and most of the problems in the next lessons start from them

---

A node has to hold three things together: its **value**, its **left** child and its **right** child. Python bundles things like that with a **class**, a blueprint for a kind of object. Here the object is a node

```text
class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None
```

`__init__` runs every time a node is built, and **self** is the node being built. A new node gets the value you give it and no children yet: **None** means "nothing here"

**Node(8)** builds one node holding 8

```py
class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None


root = Node(8)
print(root.value)
print(root.left)
```

Output

```text
8
None
```

On its own, a new node is a value with two empty children

```visual
{"use": "trees-new-node"}
```

---

A child is just another node, put in **left** or **right**. Here is the tree from the start of the lesson growing, one line at a time

```visual
{"use": "trees-grow"}
```

All of it together, with three of the nodes read back

```py
class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None


root = Node(8)
root.left = Node(3)
root.right = Node(10)
root.left.left = Node(1)
root.left.right = Node(6)
root.right.right = Node(14)

print(root.left.value)
print(root.left.right.value)
print(root.right.right.value)
```

Output

```text
3
6
14
```

Read **root.left.right** one step at a time: start at the root, go to its left child, then to that node's right child. Every node can be reached this way, from the root down along the edges. The program keeps only **root** in a variable; every other node hangs from it

That is this path down the tree

```visual
{"use": "trees-path"}
```

---

A leaf is a node whose two children are both **None**, and **is None** checks exactly that

In the tree from the start, the leaves are 1, 6 and 14

```visual
{"use": "trees-leaves"}
```

```py
class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None


root = Node(8)
root.left = Node(3)
root.right = Node(10)
root.left.left = Node(1)
root.left.right = Node(6)
root.right.right = Node(14)

leaf = root.left.left
if leaf.left is None and leaf.right is None:
    print(leaf.value, "is a leaf")
```

Output **1 is a leaf**

---

For now you build trees by hand, one node at a time. In the next lessons you'll walk through a whole tree with a few lines of code, whatever its size

---

## Mission: Build a Tree

Here is a binary tree with five nodes, with a letter where each value goes

```text
      a
     / \
    b   c
   / \
  d   e
```

1. Write the class **Node**, with a value, a left child and a right child
2. Start your program with the five values, one variable per letter: `a = 8`, `b = 3`, `c = 10`, `d = 1` and `e = 6`
3. Build the tree: a node for each value, linked as in the picture
4. Then, starting from the root and following its children, print three lines
   - **Root:** and the root's value
   - **Children:** and the root's children, left first
   - **Leaves:** and the leaves, from left to right

The values are whole numbers from -1000 to 1000, and two of them can be equal

**Example** for a = 8, b = 3, c = 10, d = 1 and e = 6

```text
Root: 8
Children: 3 10
Leaves: 1 6 10
```

**Example** for a = 50, b = 30, c = 70, d = 20 and e = 40

```text
Root: 50
Children: 30 70
Leaves: 20 40 70
```
