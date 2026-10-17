The depth-first walks dive: they go all the way down one side of the tree before they come back for the other. Sometimes you want the opposite. The root first, then everything one step below it, then everything two steps below, the way you'd read the tree on paper, line by line. That's a **level-order traversal**

---

The nodes of a tree sit on **levels**. The root is on level **0**, its children on level **1**, their children on level **2**, and so on

```text
        8            level 0
       / \
      3   10         level 1
     / \    \
    1   6    14      level 2
```

A level-order traversal visits them top to bottom and, on each level, left to right

```text
8 3 10 1 6 14
```

The number of the last level is the tree's height: here **2**, the same answer the recursive **height** gave last lesson

---

Recursion doesn't fit this walk. A recursive call on the left child finishes the whole left side before the right child gets its turn, so **1** and **6** would come out before **10**. Something else has to remember which nodes are waiting, and hand them out in the order they were found

That's a **queue**, like the line at a till. Whoever joins goes to the back, whoever is served comes from the front: first in, first out

```text
join:   Ana, then Ben, then Cris

front [ Ana  Ben  Cris ] back

serve:  Ana comes out first, then Ben
```

---

C has no queue ready-made, but an array and two indexes make one. **tail** is where the next value joins, **head** is where the next value is served from. Both start at 0, and each only ever moves forward

```text
queue[tail] = x; tail++;      join at the back
x = queue[head]; head++;      serve from the front
head < tail                   the queue isn't empty
```

```c
#include <stdio.h>

int main(void) {
    int queue[10];
    int head = 0;
    int tail = 0;

    queue[tail] = 5;
    tail++;
    queue[tail] = 7;
    tail++;
    queue[tail] = 9;
    tail++;

    printf("%d\n", queue[head]);
    head++;
    printf("%d\n", queue[head]);
    head++;
    printf("%d\n", tail - head);
    return 0;
}
```

Output

```text
5
7
1
```

**tail - head** is how many values are still waiting. A served value stays in the array, but **head** has moved past it, so it's out of the queue. Since every value joins once and the indexes never go back, the array needs room for every value that will ever join. For a tree, that's one spot per node

---

Now the walk itself. The queue holds pointers to nodes, `struct Node *`. Put the root in it. Then, as long as the queue isn't empty: take the node at the front, print it, and put its children at the back

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

void level_order(struct Node *root) {
    struct Node *queue[100];
    int head = 0;
    int tail = 0;
    queue[tail] = root;
    tail++;
    while (head < tail) {
        struct Node *node = queue[head];
        head++;
        printf("%d ", node->value);
        if (node->left != NULL) {
            queue[tail] = node->left;
            tail++;
        }
        if (node->right != NULL) {
            queue[tail] = node->right;
            tail++;
        }
    }
    printf("\n");
}

int main(void) {
    struct Node *root = new_node(8);
    root->left = new_node(3);
    root->right = new_node(10);
    root->left->left = new_node(1);
    root->left->right = new_node(6);
    root->right->right = new_node(14);

    level_order(root);

    free_tree(root);
    return 0;
}
```

Output **8 3 10 1 6 14**

The queue has room for 100 nodes, far more than this tree needs. Here it is after each node is taken out and its children put in, the part from **head** to **tail**. The children always join behind everything already waiting, so a whole level leaves the queue before the next one starts

```text
take   print   queue after
               [8]
8      8       [3, 10]
3      3       [10, 1, 6]
10     10      [1, 6, 14]
1      1       [6, 14]
6      6       [14]
14     14      []
```

The two **if** lines keep missing children out of the queue: there's no node to take out later when the child is **NULL**

---

To print each level on its own line, notice what the queue holds when a level begins: exactly the nodes of that level, and nothing else

```text
level 0 begins    [8]
level 1 begins    [3, 10]
level 2 begins    [1, 6, 14]
```

So count them first with **tail - head**, and take out exactly that many. The children they put in wait for the next round

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

void print_levels(struct Node *root) {
    struct Node *queue[100];
    int head = 0;
    int tail = 0;
    queue[tail] = root;
    tail++;
    int level = 0;
    while (head < tail) {
        int size = tail - head;
        printf("Level %d: ", level);
        for (int i = 0; i < size; i++) {
            struct Node *node = queue[head];
            head++;
            printf("%d ", node->value);
            if (node->left != NULL) {
                queue[tail] = node->left;
                tail++;
            }
            if (node->right != NULL) {
                queue[tail] = node->right;
                tail++;
            }
        }
        printf("\n");
        level++;
    }
}

int main(void) {
    struct Node *root = new_node(8);
    root->left = new_node(3);
    root->right = new_node(10);
    root->left->left = new_node(1);
    root->left->right = new_node(6);
    root->right->right = new_node(14);

    print_levels(root);

    free_tree(root);
    return 0;
}
```

Output

```text
Level 0: 8
Level 1: 3 10
Level 2: 1 6 14
```

---

Going level by level, the walk reaches every node close to the root before any node further away. That's why this walk, called **breadth-first** in general, comes back in the graph lessons: it finds the shortest way from one place to another

---

## Mission: Read a Tree by Levels

Here is a binary tree with seven nodes, with a letter where each value goes

```text
        a
       / \
      b   c
     /   / \
    d   e   f
         \
          g
```

1. Write the struct **Node**, with a value, a left child and a right child
2. Start **main** with the seven values, one `int` variable per letter, from `a` to `g`
3. Build the tree: a node for each value, linked as in the picture
4. Walk it level by level with a queue, and print one line per level: **Level**, the level's number, a colon, and the values on that level from left to right
5. Free every node before **main** returns

The values are whole numbers from -1000 to 1000, and two of them can be equal

**Example** for a = 1, b = 2, c = 3, d = 4, e = 5, f = 6 and g = 7

```text
Level 0: 1
Level 1: 2 3
Level 2: 4 5 6
Level 3: 7
```

**Example** for a = 40, b = 20, c = 60, d = 10, e = 50, f = 70 and g = 55

```text
Level 0: 40
Level 1: 20 60
Level 2: 10 50 70
Level 3: 55
```
