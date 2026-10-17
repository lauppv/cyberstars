To find a value in a tree you've seen so far, you have to look at every node: it could be anywhere. A **binary search tree** keeps its values in an order that tells you which way to go, so a search skips whole parts of the tree without looking at them

---

The rule is about every node, not only the root: everything in its **left** side is **smaller** than it, and everything in its **right** side is **larger**

The tree from the last lessons follows it

```text
        8
       / \
      3   10
     / \    \
    1   6    14
```

- Left of **8** are 3, 1 and 6, all smaller. Right of it are 10 and 14, both larger
- Left of **3** is 1, smaller. Right of it is 6, larger, and still smaller than 8, since it sits in 8's left side
- Right of **10** is 14, larger

That's why the inorder walk printed it sorted: inorder prints everything smaller than a node, then the node, then everything larger

In this lesson the values in a tree are all different, so the rule never has to say where an equal value goes

---

**Searching** follows one path down. At each node, compare the value you want with the node's. Equal: found it. Smaller: it can only be in the left side. Larger: only in the right side. If the path runs out, at **None**, the value isn't in the tree

Searching for **6**

```visual
{"use": "bst-search-6"}
```

Searching for **12**

```visual
{"use": "bst-search-12"}
```

Three nodes looked at, out of six. Each step down leaves a whole side of the tree behind

As a recursive function, it's the same three questions, plus the base case for a path that ran out

```py
class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None


def search(node, target):
    if node is None:
        return False
    if target == node.value:
        return True
    if target < node.value:
        return search(node.left, target)
    return search(node.right, target)


root = Node(8)
root.left = Node(3)
root.right = Node(10)
root.left.left = Node(1)
root.left.right = Node(6)
root.right.right = Node(14)

print(search(root, 6))
print(search(root, 12))
```

Output

```text
True
False
```

---

**Inserting** walks the same path a search would. Where the path runs out, at **None**, is exactly where the new value belongs, so that's where its node goes

```text
def insert(node, value):
    if node is None:
        return Node(value)
    if value < node.value:
        node.left = insert(node.left, value)
    else:
        node.right = insert(node.right, value)
    return node
```

**insert** gives back the node it was called on, with the new value somewhere below it. Only at the bottom, where it was called on **None**, does it give back a brand new node, and the parent one level up stores it in **left** or **right**

An empty tree is **None**, and inserting into it makes the root. Here is the tree from the lesson growing out of the values 8, 3, 10, 1, 6 and 14, inserted in that order

```visual
{"use": "bst-insert"}
```

Put together, with an inorder walk to read it back

```py
class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None


def insert(node, value):
    if node is None:
        return Node(value)
    if value < node.value:
        node.left = insert(node.left, value)
    else:
        node.right = insert(node.right, value)
    return node


def inorder(node):
    if node is None:
        return
    inorder(node.left)
    print(node.value, end=" ")
    inorder(node.right)


root = None
for value in [8, 3, 10, 1, 6, 14]:
    root = insert(root, value)

inorder(root)
print()
```

Output **1 3 6 8 10 14**

The values went in mixed up and came out sorted. A binary search tree is one more way to sort

---

The order the values go in decides the tree's shape. Insert the same five values in two orders

```text
3, 1, 4, 2, 5              1, 2, 3, 4, 5

      3                    1
     / \                    \
    1   4                    2
     \   \                    \
      2   5                    3
                                \
                                 4
                                  \
                                   5
```

On the left, a tree of height 2. On the right, sorted input made every value larger than the last, so each one went right, and the tree is a line of height 4. A search for 5 there visits every node, no faster than going through a list

The height is what a search costs: one node looked at per level. So a tree is only fast when it stays bushy and low. There are binary search trees that rebalance themselves as values come in, so they never turn into a line, like the **AVL** and the **red-black** tree; they build on everything in this lesson

---

## Mission: Grow a Search Tree

1. Write the class **Node**, with a value, a left child and a right child
2. Start your program with two variables: **values**, a list of whole numbers, and **target**, a whole number. For example `values = [50, 30, 70, 20, 40, 60, 80]` and `target = 60`
3. Starting from an empty tree, insert the values into a binary search tree one at a time, in the order of the list
4. Then, with recursive functions, print three lines
   - **Sorted:** and the values of the tree, from an inorder walk
   - **Height:** and the tree's height
   - **Search**, the target, a colon and **found** if the target is in the tree, or **not found** if it isn't. Find it by searching the tree, not the list

**values** holds from 1 to 7 numbers, all different, and every number, the target too, is from -1000 to 1000

**Example** for values = [50, 30, 70, 20, 40, 60, 80] and target = 60

```text
Sorted: 20 30 40 50 60 70 80
Height: 2
Search 60: found
```

**Example** for values = [1, 2, 3, 4, 5] and target = 6

```text
Sorted: 1 2 3 4 5
Height: 4
Search 6: not found
```
