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

**Searching** follows one path down. At each node, compare the value you want with the node's. Equal: found it. Smaller: it can only be in the left side. Larger: only in the right side. If the path runs out, at **NULL**, the value isn't in the tree

Searching for **6**

```text
        8          6 is smaller than 8: go left
       /
      3            6 is larger than 3: go right
       \
        6          found
```

Searching for **12**

```text
        8          12 is larger than 8: go right
         \
          10       12 is larger than 10: go right
            \
             14    12 is smaller than 14: go left
            /
        NULL       not in the tree
```

Three nodes looked at, out of six. Each step down leaves a whole side of the tree behind

As a recursive function, it's the same three questions, plus the base case for a path that ran out. It returns 1 for found and 0 for not found

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

void free_tree(struct Node *node) {
    if (node == NULL) {
        return;
    }
    free_tree(node->left);
    free_tree(node->right);
    free(node);
}

int search(struct Node *node, int target) {
    if (node == NULL) {
        return 0;
    }
    if (target == node->value) {
        return 1;
    }
    if (target < node->value) {
        return search(node->left, target);
    }
    return search(node->right, target);
}

int main(void) {
    struct Node *root = new_node(8);
    root->left = new_node(3);
    root->right = new_node(10);
    root->left->left = new_node(1);
    root->left->right = new_node(6);
    root->right->right = new_node(14);

    printf("%d\n", search(root, 6));
    printf("%d\n", search(root, 12));

    free_tree(root);
    return 0;
}
```

Output

```text
1
0
```

---

**Inserting** walks the same path a search would. Where the path runs out, at **NULL**, is exactly where the new value belongs, so that's where its node goes

```text
struct Node *insert(struct Node *node, int value) {
    if (node == NULL) {
        return new_node(value);
    }
    if (value < node->value) {
        node->left = insert(node->left, value);
    } else {
        node->right = insert(node->right, value);
    }
    return node;
}
```

**insert** gives back the node it was called on, with the new value somewhere below it. Only at the bottom, where it was called on **NULL**, does it give back a brand new node, and the parent one level up stores it in **left** or **right**

An empty tree is **NULL**, and inserting into it makes the root. Here is the tree from the lesson growing out of the values 8, 3, 10, 1, 6 and 14, inserted in that order

```text
insert 8: the tree is empty, 8 becomes the root

        8

insert 3: smaller than 8, left of it

        8
       /
      3

insert 10: larger than 8, right of it

        8
       / \
      3   10

insert 1: smaller than 8, smaller than 3

        8
       / \
      3   10
     /
    1

insert 6: smaller than 8, larger than 3

        8
       / \
      3   10
     / \
    1   6

insert 14: larger than 8, larger than 10

        8
       / \
      3   10
     / \    \
    1   6    14
```

Put together, with an inorder walk to read it back

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

void free_tree(struct Node *node) {
    if (node == NULL) {
        return;
    }
    free_tree(node->left);
    free_tree(node->right);
    free(node);
}

struct Node *insert(struct Node *node, int value) {
    if (node == NULL) {
        return new_node(value);
    }
    if (value < node->value) {
        node->left = insert(node->left, value);
    } else {
        node->right = insert(node->right, value);
    }
    return node;
}

void inorder(struct Node *node) {
    if (node == NULL) {
        return;
    }
    inorder(node->left);
    printf("%d ", node->value);
    inorder(node->right);
}

int main(void) {
    int values[] = {8, 3, 10, 1, 6, 14};
    struct Node *root = NULL;
    for (int i = 0; i < 6; i++) {
        root = insert(root, values[i]);
    }

    inorder(root);
    printf("\n");

    free_tree(root);
    return 0;
}
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

On the left, a tree of height 2. On the right, sorted input made every value larger than the last, so each one went right, and the tree is a line of height 4. A search for 5 there visits every node, no faster than going through an array

The height is what a search costs: one node looked at per level. So a tree is only fast when it stays bushy and low. There are binary search trees that rebalance themselves as values come in, so they never turn into a line, like the **AVL** and the **red-black** tree; they build on everything in this lesson

---

## Mission: Grow a Search Tree

1. Write the struct **Node**, with a value, a left child and a right child
2. Read the input with **scanf**: on the first line **n**, how many values there are, on the second line the **n** values, and on the third line a **target** value
3. Starting from an empty tree, insert the values into a binary search tree one at a time, in the order they were read
4. Then, with recursive functions, print three lines
   - **Sorted:** and the values of the tree, from an inorder walk
   - **Height:** and the tree's height
   - **Search**, the target, a colon and **found** if the target is in the tree, or **not found** if it isn't. Find it by searching the tree, not the values you read
5. Free every node before **main** returns

**n** is from 1 to 7, the values are all different, and every number, the target too, is from -1000 to 1000

**Example**

Input

```text
7
50 30 70 20 40 60 80
60
```

Output

```text
Sorted: 20 30 40 50 60 70 80
Height: 2
Search 60: found
```

**Example**

Input

```text
5
1 2 3 4 5
6
```

Output

```text
Sorted: 1 2 3 4 5
Height: 4
Search 6: not found
```
