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

void print_leaves(struct Node *node) {
    if (node == NULL) {
        return;
    }
    if (node->left == NULL || node->right == NULL) {
        printf("%d ", node->value);
    }
    print_leaves(node->left);
    print_leaves(node->right);
}

int main(void) {
    int n;
    scanf("%d", &n);
    struct Node *root = NULL;
    for (int i = 0; i < n; i++) {
        int value;
        scanf("%d", &value);
        root = insert(root, value);
    }
    int target;
    scanf("%d", &target);

    struct Node *queue[7];
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

    printf("Leaves: ");
    print_leaves(root);
    printf("\n");

    printf("Path to %d: ", target);
    struct Node *node = root;
    while (node->value != target) {
        printf("%d ", node->value);
        if (target < node->value) {
            node = node->left;
        } else {
            node = node->right;
        }
    }
    printf("%d\n", node->value);

    free_tree(root);
    return 0;
}
