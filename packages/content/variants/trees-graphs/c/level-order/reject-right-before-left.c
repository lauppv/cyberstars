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

int main(void) {
    int a = 1;
    int b = 2;
    int c = 3;
    int d = 4;
    int e = 5;
    int f = 6;
    int g = 7;

    struct Node *root = new_node(a);
    root->left = new_node(b);
    root->right = new_node(c);
    root->left->left = new_node(d);
    root->right->left = new_node(e);
    root->right->right = new_node(f);
    root->right->left->right = new_node(g);

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
            if (node->right != NULL) {
                queue[tail] = node->right;
                tail++;
            }
            if (node->left != NULL) {
                queue[tail] = node->left;
                tail++;
            }
        }
        printf("\n");
        level++;
    }

    free_tree(root);
    return 0;
}
