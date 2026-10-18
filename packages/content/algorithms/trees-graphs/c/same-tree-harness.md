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

#line 1 "main.c"
{{code: same_tree}}

static char first_line[16384];
static char second_line[16384];

int main(void) {
    fgets(first_line, sizeof(first_line), stdin);
    fgets(second_line, sizeof(second_line), stdin);
    struct Node *first = build_tree(first_line);
    struct Node *second = build_tree(second_line);
    printf("%s\n", same_tree(first, second) ? "true" : "false");
    free_tree(first);
    free_tree(second);
    return 0;
}
```
