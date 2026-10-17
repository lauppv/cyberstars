Last lesson you built a tree by hand and read its nodes one path at a time: **root->left->right**. That works for five nodes. A real tree can hold thousands, and you don't know its shape in advance. You need a way to visit every node, whatever the tree looks like, with a few lines of code

The way to do it is **recursion**, and it needs a short introduction first

---

A function can call any function, itself included. A function that calls itself is **recursive**

```c
#include <stdio.h>

void countdown(int n) {
    if (n == 0) {
        printf("Go!\n");
        return;
    }
    printf("%d\n", n);
    countdown(n - 1);
}

int main(void) {
    countdown(3);
    return 0;
}
```

Output

```text
3
2
1
Go!
```

**countdown(3)** prints 3 and hands the rest of the job to **countdown(2)**, which prints 2 and hands it to **countdown(1)**, and so on down to **countdown(0)**. That one doesn't call anything: it prints **Go!** and returns

```text
countdown(3)    prints 3, calls countdown(2)
countdown(2)    prints 2, calls countdown(1)
countdown(1)    prints 1, calls countdown(0)
countdown(0)    prints Go!, returns
```

Every call works on a smaller piece of the problem, until the piece is so small the answer is obvious. That last case is the **base case**, and it's the **if** at the top of the function: there the function stops calling itself

---

A recursive function can return a value, built from what the smaller call returned. The sum 1 + 2 + ... + n is n plus the sum up to n - 1, and the sum up to 0 is 0

```c
#include <stdio.h>

int sum_to(int n) {
    if (n == 0) {
        return 0;
    }
    return n + sum_to(n - 1);
}

int main(void) {
    printf("%d\n", sum_to(4));
    return 0;
}
```

Output **10**

The calls go down to the base case, then the answers come back up, each one finishing the addition it was waiting on

```text
sum_to(4) = 4 + sum_to(3)
sum_to(3) = 3 + sum_to(2)
sum_to(2) = 2 + sum_to(1)
sum_to(1) = 1 + sum_to(0)
sum_to(0) = 0                 base case

then back up: 1 + 0 = 1, 2 + 1 = 3, 3 + 3 = 6, 4 + 6 = 10
```

Each call waiting for an answer keeps its own **n**, in its own spot in memory, on the **call stack**. Forget the base case and the calls never stop: each one takes a little more stack, until it runs out and the program crashes, usually with **Segmentation fault**. Every recursive function needs a base case it is sure to reach

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

So a tree is a root plus two smaller trees. That's exactly the shape recursion likes: to do something with a tree, do it with the root, and let the same function handle the two smaller trees. The base case is the empty tree, **NULL**: there's nothing to do there

---

Here is the whole idea. **show** prints every value in the tree

```c
#include <stdio.h>
#include <stdlib.h>

struct Node {
    int value;
    struct Node *left;
    struct Node *right;
};

struct Node *new_node(int value) {
    struct Node *node = malloc(sizeof(struct Node));
    node->value = value;
    node->left = NULL;
    node->right = NULL;
    return node;
}

void show(struct Node *node) {
    if (node == NULL) {
        return;
    }
    printf("%d\n", node->value);
    show(node->left);
    show(node->right);
}

int main(void) {
    struct Node *root = new_node(8);
    root->left = new_node(3);
    root->right = new_node(10);
    root->left->left = new_node(1);
    root->left->right = new_node(6);
    root->right->right = new_node(14);

    show(root);

    free(root->left->left);
    free(root->left->right);
    free(root->right->right);
    free(root->left);
    free(root->right);
    free(root);
    return 0;
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

**show(root)** prints 8, then calls **show** on the left child, which prints 3 and goes down again. When it reaches a missing child, **node == NULL** sends it straight back up, and the walk carries on from where it was. Nothing in **show** knows how big the tree is: the same few lines work for any tree

The six **free** lines at the end don't have that luck: they only fit this one tree. Recursion fixes that too, a bit further down

---

**show** did three things at every node: print the node, walk the left side, walk the right side. Swap the order of those three lines and you get a different walk. Each order has a name, and together they're the **depth-first traversals**: each one goes all the way down one side before it comes back for the other

**Preorder:** the node first, then its left side, then its right side

```text
void preorder(struct Node *node) {
    if (node == NULL) {
        return;
    }
    printf("%d ", node->value);
    preorder(node->left);
    preorder(node->right);
}
```

That's the walk **show** did

```visual
{"use": "traversals-preorder"}
```

**Inorder:** the left side first, then the node, then the right side

```text
void inorder(struct Node *node) {
    if (node == NULL) {
        return;
    }
    inorder(node->left);
    printf("%d ", node->value);
    inorder(node->right);
}
```

```visual
{"use": "traversals-inorder"}
```

Look at the order: the numbers came out sorted. That's no accident here, and the lesson on binary search trees will show why

**Postorder:** the left side, then the right side, and the node last

```text
void postorder(struct Node *node) {
    if (node == NULL) {
        return;
    }
    postorder(node->left);
    postorder(node->right);
    printf("%d ", node->value);
}
```

```visual
{"use": "traversals-postorder"}
```

A node is printed only after everything below it. That's the order to use when the children have to be dealt with before their parent, and in C you already know one job like that: freeing. A node can't be freed before its children, or its pointers to them can't be read any more. A postorder walk that frees instead of printing frees any tree, whatever its size

```text
void free_tree(struct Node *node) {
    if (node == NULL) {
        return;
    }
    free_tree(node->left);
    free_tree(node->right);
    free(node);
}
```

From here on, **free_tree(root)** replaces the list of **free** lines

---

The three of them on the same tree. **printf("%d ", ...)** keeps the values on one line, and **printf("\n")** ends it

```c
#include <stdio.h>
#include <stdlib.h>

struct Node {
    int value;
    struct Node *left;
    struct Node *right;
};

struct Node *new_node(int value) {
    struct Node *node = malloc(sizeof(struct Node));
    node->value = value;
    node->left = NULL;
    node->right = NULL;
    return node;
}

void preorder(struct Node *node) {
    if (node == NULL) {
        return;
    }
    printf("%d ", node->value);
    preorder(node->left);
    preorder(node->right);
}

void inorder(struct Node *node) {
    if (node == NULL) {
        return;
    }
    inorder(node->left);
    printf("%d ", node->value);
    inorder(node->right);
}

void postorder(struct Node *node) {
    if (node == NULL) {
        return;
    }
    postorder(node->left);
    postorder(node->right);
    printf("%d ", node->value);
}

void free_tree(struct Node *node) {
    if (node == NULL) {
        return;
    }
    free_tree(node->left);
    free_tree(node->right);
    free(node);
}

int main(void) {
    struct Node *root = new_node(8);
    root->left = new_node(3);
    root->right = new_node(10);
    root->left->left = new_node(1);
    root->left->right = new_node(6);
    root->right->right = new_node(14);

    preorder(root);
    printf("\n");
    inorder(root);
    printf("\n");
    postorder(root);
    printf("\n");

    free_tree(root);
    return 0;
}
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

```c
#include <stdio.h>
#include <stdlib.h>

struct Node {
    int value;
    struct Node *left;
    struct Node *right;
};

struct Node *new_node(int value) {
    struct Node *node = malloc(sizeof(struct Node));
    node->value = value;
    node->left = NULL;
    node->right = NULL;
    return node;
}

int height(struct Node *node) {
    if (node == NULL) {
        return -1;
    }
    int left = height(node->left);
    int right = height(node->right);
    if (left > right) {
        return 1 + left;
    }
    return 1 + right;
}

void free_tree(struct Node *node) {
    if (node == NULL) {
        return;
    }
    free_tree(node->left);
    free_tree(node->right);
    free(node);
}

int main(void) {
    struct Node *root = new_node(8);
    root->left = new_node(3);
    root->right = new_node(10);
    root->left->left = new_node(1);
    root->left->right = new_node(6);
    root->right->right = new_node(14);

    printf("%d\n", height(root));
    printf("%d\n", height(root->right));
    printf("%d\n", height(root->left->left));

    free_tree(root);
    return 0;
}
```

Output

```text
2
1
0
```

Follow it from the bottom up, with each node's answer in brackets. Every leaf answers 0. **10** answers 1 + the larger of -1 and 0, so 1, and so does **3**. The root answers 1 + the larger of 1 and 1: **2**

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
int count(struct Node *node) {
    if (node == NULL) {
        return 0;
    }
    return 1 + count(node->left) + count(node->right);
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

1. Write the struct **Node**, with a value, a left child and a right child
2. Start **main** with the seven values, one `int` variable per letter, from `a` to `g`
3. Build the tree: a node for each value, linked as in the picture
4. Write a recursive function for each of the three depth-first traversals, and use them to print three lines
   - **Preorder:** and the values in preorder
   - **Inorder:** and the values in inorder
   - **Postorder:** and the values in postorder
5. Free every node before **main** returns

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
