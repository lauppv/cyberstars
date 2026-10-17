```c
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

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

// Turns a line like "8 4 11 2 null 9 15" into linked nodes, level by level.
struct Node *build_tree(char *line) {
    static struct Node *queue[1024];
    char *token = strtok(line, " \r\n");
    if (token == NULL || strcmp(token, "null") == 0) {
        return NULL;
    }
    struct Node *root = new_node(atoi(token));
    int head = 0;
    int tail = 0;
    queue[tail++] = root;
    while ((token = strtok(NULL, " \r\n")) != NULL) {
        struct Node *node = queue[head++];
        if (strcmp(token, "null") != 0) {
            node->left = new_node(atoi(token));
            queue[tail++] = node->left;
        }
        token = strtok(NULL, " \r\n");
        if (token == NULL) {
            break;
        }
        if (strcmp(token, "null") != 0) {
            node->right = new_node(atoi(token));
            queue[tail++] = node->right;
        }
    }
    return root;
}

void free_tree(struct Node *node) {
    if (node == NULL) {
        return;
    }
    free_tree(node->left);
    free_tree(node->right);
    free(node);
}

bool has_path_sum(struct Node *root, int target) {
    if (root == NULL) {
        return false;
    }
    int rest = target - root->value;
    if (root->left == NULL && root->right == NULL) {
        return rest == 0;
    }
    return has_path_sum(root->left, rest) || has_path_sum(root->right, rest);
}

static char line[16384];

int main(void) {
    int target;
    fgets(line, sizeof(line), stdin);
    scanf("%d", &target);
    struct Node *root = build_tree(line);
    printf("%s\n", has_path_sum(root, target) ? "true" : "false");
    free_tree(root);
    return 0;
}
```
