Last lesson you built a tree by hand and read its nodes one path at a time: **root.left.right**. That works for five nodes. A real tree can hold thousands, and you don't know its shape in advance. You need a way to visit every node, whatever the tree looks like, with a few lines of code

The way to do it is **recursion**

---

A quick recap, in case it's been a while. A **recursive** function is one that calls itself. Each call works on a smaller piece of the problem, until the piece is so small the answer is obvious: that's the **base case**, and there the function stops calling itself

```py
def countdown(n):
    if n == 0:
        print("Go!")
        return
    print(n)
    countdown(n - 1)


countdown(3)
```

Output

```text
3
2
1
Go!
```

**countdown(3)** prints 3 and hands the rest of the job to **countdown(2)**, which hands it to **countdown(1)**, and so on down to **countdown(0)**, the base case. Without that **if**, the calls would never stop

---

Now look at a tree again

```text
        8
       / \
      3   10
     / \    \
    1   6    14
```

Cover the root with your hand. What's left is two smaller trees: one starting at **3**, one starting at **10**. Each of them is a root with two smaller trees under it, and so on, down to the leaves

```text
      3        10
     / \         \
    1   6         14
```

So a tree is a root plus two smaller trees. That's exactly the shape recursion likes: to do something with a tree, do it with the root, and let the same function handle the two smaller trees. The base case is the empty tree, **None**: there's nothing to do there

---

Here is the whole idea in four lines. **show** prints every value in the tree

```py
class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None


def show(node):
    if node is None:
        return
    print(node.value)
    show(node.left)
    show(node.right)


root = Node(8)
root.left = Node(3)
root.right = Node(10)
root.left.left = Node(1)
root.left.right = Node(6)
root.right.right = Node(14)

show(root)
```

Output

```text
8
3
1
6
10
14
```

**show(root)** prints 8, then calls **show** on the left child, which prints 3 and goes down again. When it reaches a missing child, **node is None** sends it straight back up, and the walk carries on from where it was. Nothing in **show** knows how big the tree is: the same four lines work for any tree

---

**show** did three things at every node: print the node, walk the left side, walk the right side. Swap the order of those three lines and you get a different walk. Each order has a name, and together they're the **depth-first traversals**: each one goes all the way down one side before it comes back for the other

**Preorder:** the node first, then its left side, then its right side

```text
def preorder(node):
    if node is None:
        return
    print(node.value, end=" ")
    preorder(node.left)
    preorder(node.right)
```

That's the walk **show** did. The numbers in brackets give the order each node is printed in

```text
          8 (1)
         / \
    (2) 3   10 (5)
       / \    \
  (3) 1   6    14 (6)
         (4)

Preorder: 8 3 1 6 10 14
```

**Inorder:** the left side first, then the node, then the right side

```text
def inorder(node):
    if node is None:
        return
    inorder(node.left)
    print(node.value, end=" ")
    inorder(node.right)
```

```text
          8 (4)
         / \
    (2) 3   10 (5)
       / \    \
  (1) 1   6    14 (6)
         (3)

Inorder: 1 3 6 8 10 14
```

Look at that line: the numbers came out sorted. That's no accident here, and the lesson on binary search trees will show why

**Postorder:** the left side, then the right side, and the node last

```text
def postorder(node):
    if node is None:
        return
    postorder(node.left)
    postorder(node.right)
    print(node.value, end=" ")
```

```text
          8 (6)
         / \
    (3) 3   10 (5)
       / \    \
  (1) 1   6    14 (4)
         (2)

Postorder: 1 6 3 14 10 8
```

A node is printed only after everything below it. That's the order to use when the children have to be dealt with before their parent, like deleting a folder: its files go first

---

The three of them on the same tree. **end=" "** keeps the values on one line, and the empty **print()** ends it

```py
class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None


def preorder(node):
    if node is None:
        return
    print(node.value, end=" ")
    preorder(node.left)
    preorder(node.right)


def inorder(node):
    if node is None:
        return
    inorder(node.left)
    print(node.value, end=" ")
    inorder(node.right)


def postorder(node):
    if node is None:
        return
    postorder(node.left)
    postorder(node.right)
    print(node.value, end=" ")


root = Node(8)
root.left = Node(3)
root.right = Node(10)
root.left.left = Node(1)
root.left.right = Node(6)
root.right.right = Node(14)

preorder(root)
print()
inorder(root)
print()
postorder(root)
print()
```

Output

```text
8 3 1 6 10 14
1 3 6 8 10 14
1 6 3 14 10 8
```

---

A recursive function can also **return** something about the tree. The **height** is the number of edges on the longest way down from the root. Think of it the recursive way: the tree is the root on top of its two smaller trees, so its height is one edge more than the taller of the two

```text
height(8) = 1 + the larger of height(3) and height(10)
```

The base case needs care. A single leaf has height 0, and it's one edge above its two missing children. So an empty tree counts as **-1**: then a leaf gets 1 + (-1) = 0, as it should

```py
class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None


def height(node):
    if node is None:
        return -1
    return 1 + max(height(node.left), height(node.right))


root = Node(8)
root.left = Node(3)
root.right = Node(10)
root.left.left = Node(1)
root.left.right = Node(6)
root.right.right = Node(14)

print(height(root))
print(height(root.right))
print(height(root.left.left))
```

Output

```text
2
1
0
```

Follow it from the bottom up, with each node's answer in brackets. Every leaf answers 0. **10** answers 1 + max(-1, 0) = 1, and so does **3**. The root answers 1 + max(1, 1) = **2**

```text
          8 (2)
         / \
    (1) 3   10 (1)
       / \    \
  (0) 1   6    14 (0)
         (0)
```

---

The same pattern counts nodes, adds up values or finds the largest one. Decide what the empty tree answers, then build a node's answer from its two children's

```text
def count(node):
    if node is None:
        return 0
    return 1 + count(node.left) + count(node.right)
```

---

## Mission: Walk a Tree

Here is a binary tree with seven nodes, with a letter where each value goes

```text
        a
       / \
      b   c
     / \   \
    d   e   f
       /
      g
```

1. Write the class **Node**, with a value, a left child and a right child
2. Start your program with the seven values, one variable per letter, from `a` to `g`
3. Build the tree: a node for each value, linked as in the picture
4. Write a recursive function for each of the three depth-first traversals, and use them to print three lines
   - **Preorder:** and the values in preorder
   - **Inorder:** and the values in inorder
   - **Postorder:** and the values in postorder

The values are whole numbers from -1000 to 1000, and two of them can be equal

**Example** for a = 1, b = 2, c = 3, d = 4, e = 5, f = 6 and g = 7

```text
Preorder: 1 2 4 5 7 3 6
Inorder: 4 2 7 5 1 3 6
Postorder: 4 7 5 2 6 3 1
```

**Example** for a = 50, b = 30, c = 70, d = 20, e = 40, f = 80 and g = 35

```text
Preorder: 50 30 20 40 35 70 80
Inorder: 20 30 35 40 50 70 80
Postorder: 20 35 40 30 80 70 50
```
