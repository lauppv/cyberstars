Last lesson you built a tree by hand and read its nodes one path at a time: **root.left.right**. That works for five nodes. A real tree can hold thousands, and you don't know its shape in advance. You need a way to visit every node, whatever the tree looks like, with a few lines of code

The way to do it is **recursion**, and it starts with methods that call themselves

---

A method can call any method, itself included. A method that calls itself is **recursive**. It sounds like it should never end, and it would, unless every call works on a smaller piece of the problem and one piece is small enough to answer straight away. That smallest piece is the **base case**: there the method returns without calling itself again

Counting down from 3

```java
public class Main {
    static void countdown(int n) {
        if (n == 0) {
            System.out.println("Go!");
            return;
        }
        System.out.println(n);
        countdown(n - 1);
    }

    public static void main(String[] args) {
        countdown(3);
    }
}
```

Output

```text
3
2
1
Go!
```

**countdown(3)** prints 3 and hands the rest of the job to **countdown(2)**, which prints 2 and hands it to **countdown(1)**, and so on down to **countdown(0)**. That's the base case: it prints **Go!** and returns, and every call before it has nothing left to do, so they all return too

---

A recursive method can also **return** a value, built from the answer of the smaller call. The sum 1 + 2 + ... + n is n plus the sum up to n - 1, and the sum up to 0 is 0

```java
public class Main {
    static int sumTo(int n) {
        if (n == 0) {
            return 0;
        }
        return n + sumTo(n - 1);
    }

    public static void main(String[] args) {
        System.out.println(sumTo(4));
    }
}
```

Output **10**

Each call waits for the one it made, then adds its own number

```text
sumTo(4) = 4 + sumTo(3)
             sumTo(3) = 3 + sumTo(2)
                          sumTo(2) = 2 + sumTo(1)
                                       sumTo(1) = 1 + sumTo(0)
                                                    sumTo(0) = 0
                                       sumTo(1) = 1 + 0 = 1
                          sumTo(2) = 2 + 1 = 3
             sumTo(3) = 3 + 3 = 6
sumTo(4) = 4 + 6 = 10
```

Every call that hasn't returned yet takes a bit of memory, on what Java calls the **stack**. Forget the base case, or write one the calls never reach, and they pile up until the stack runs out: the program stops with a **StackOverflowError**. When you see one, look at the base case first

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

So a tree is a root plus two smaller trees. That's exactly the shape recursion likes: to do something with a tree, do it with the root, and let the same method handle the two smaller trees. The base case is the empty tree, **null**: there's nothing to do there

---

Here is the whole idea in a few lines. **show** prints every value in the tree

```java
class Node {
    int value;
    Node left;
    Node right;

    Node(int value) {
        this.value = value;
    }
}

public class Main {
    static void show(Node node) {
        if (node == null) {
            return;
        }
        System.out.println(node.value);
        show(node.left);
        show(node.right);
    }

    public static void main(String[] args) {
        Node root = new Node(8);
        root.left = new Node(3);
        root.right = new Node(10);
        root.left.left = new Node(1);
        root.left.right = new Node(6);
        root.right.right = new Node(14);

        show(root);
    }
}
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

**show(root)** prints 8, then calls **show** on the left child, which prints 3 and goes down again. When it reaches a missing child, **node == null** sends it straight back up, and the walk carries on from where it was. Nothing in **show** knows how big the tree is: the same lines work for any tree

---

**show** did three things at every node: print the node, walk the left side, walk the right side. Swap the order of those three lines and you get a different walk. Each order has a name, and together they're the **depth-first traversals**: each one goes all the way down one side before it comes back for the other

**Preorder:** the node first, then its left side, then its right side

```text
static void preorder(Node node) {
    if (node == null) {
        return;
    }
    System.out.print(node.value + " ");
    preorder(node.left);
    preorder(node.right);
}
```

That's the walk **show** did

```visual
{"use": "traversals-preorder"}
```

**Inorder:** the left side first, then the node, then the right side

```text
static void inorder(Node node) {
    if (node == null) {
        return;
    }
    inorder(node.left);
    System.out.print(node.value + " ");
    inorder(node.right);
}
```

```visual
{"use": "traversals-inorder"}
```

Look at the order: the numbers came out sorted. That's no accident here, and the lesson on binary search trees will show why

**Postorder:** the left side, then the right side, and the node last

```text
static void postorder(Node node) {
    if (node == null) {
        return;
    }
    postorder(node.left);
    postorder(node.right);
    System.out.print(node.value + " ");
}
```

```visual
{"use": "traversals-postorder"}
```

A node is printed only after everything below it. That's the order to use when the children have to be dealt with before their parent, like deleting a folder: its files go first

---

The three of them on the same tree. **System.out.print** keeps the values on one line, and the empty **System.out.println()** ends it

```java
class Node {
    int value;
    Node left;
    Node right;

    Node(int value) {
        this.value = value;
    }
}

public class Main {
    static void preorder(Node node) {
        if (node == null) {
            return;
        }
        System.out.print(node.value + " ");
        preorder(node.left);
        preorder(node.right);
    }

    static void inorder(Node node) {
        if (node == null) {
            return;
        }
        inorder(node.left);
        System.out.print(node.value + " ");
        inorder(node.right);
    }

    static void postorder(Node node) {
        if (node == null) {
            return;
        }
        postorder(node.left);
        postorder(node.right);
        System.out.print(node.value + " ");
    }

    public static void main(String[] args) {
        Node root = new Node(8);
        root.left = new Node(3);
        root.right = new Node(10);
        root.left.left = new Node(1);
        root.left.right = new Node(6);
        root.right.right = new Node(14);

        preorder(root);
        System.out.println();
        inorder(root);
        System.out.println();
        postorder(root);
        System.out.println();
    }
}
```

Output

```text
8 3 1 6 10 14
1 3 6 8 10 14
1 6 3 14 10 8
```

---

A recursive method can also **return** something about the tree. The **height** is the number of edges on the longest way down from the root. Think of it the recursive way: the tree is the root on top of its two smaller trees, so its height is one edge more than the taller of the two

```text
height(8) = 1 + the larger of height(3) and height(10)
```

The base case needs care. A single leaf has height 0, and it's one edge above its two missing children. So an empty tree counts as **-1**: then a leaf gets 1 + (-1) = 0, as it should. **Math.max** gives the larger of two numbers

```java
class Node {
    int value;
    Node left;
    Node right;

    Node(int value) {
        this.value = value;
    }
}

public class Main {
    static int height(Node node) {
        if (node == null) {
            return -1;
        }
        return 1 + Math.max(height(node.left), height(node.right));
    }

    public static void main(String[] args) {
        Node root = new Node(8);
        root.left = new Node(3);
        root.right = new Node(10);
        root.left.left = new Node(1);
        root.left.right = new Node(6);
        root.right.right = new Node(14);

        System.out.println(height(root));
        System.out.println(height(root.right));
        System.out.println(height(root.left.left));
    }
}
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
static int count(Node node) {
    if (node == null) {
        return 0;
    }
    return 1 + count(node.left) + count(node.right);
}
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
2. Start **main** with the seven values, one `int` variable per letter, from `a` to `g`
3. Build the tree: a node for each value, linked as in the picture
4. Write a recursive method for each of the three depth-first traversals, and use them to print three lines
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
