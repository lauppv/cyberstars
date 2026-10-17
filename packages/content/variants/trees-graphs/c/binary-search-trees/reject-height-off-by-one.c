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

int height(struct Node *node) {
    if (node == NULL) {
        return 0;
    }
    int left = height(node->left);
    int right = height(node->right);
    if (left > right) {
        return 1 + left;
    }
    return 1 + right;
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

    printf("Sorted: ");
    inorder(root);
    printf("\n");
    printf("Height: %d\n", height(root));
    if (search(root, target)) {
        printf("Search %d: found\n", target);
    } else {
        printf("Search %d: not found\n", target);
    }

    free_tree(root);
    return 0;
}
