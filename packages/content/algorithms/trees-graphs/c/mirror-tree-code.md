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

// Prints a tree as one line, level by level, like the input.
void print_tree(struct Node *root) {
    static struct Node *queue[1024];
    static char text[16384];
    if (root == NULL) {
        printf("null\n");
        return;
    }
    int head = 0;
    int tail = 0;
    int used = sprintf(text, "%d", root->value);
    // Where the last value ends: the nulls after it are left out.
    int kept = used;
    queue[tail++] = root;
    while (head < tail) {
        struct Node *node = queue[head++];
        struct Node *children[2] = {node->left, node->right};
        for (int i = 0; i < 2; i++) {
            if (children[i] == NULL) {
                used += sprintf(text + used, " null");
            } else {
                used += sprintf(text + used, " %d", children[i]->value);
                kept = used;
                queue[tail++] = children[i];
            }
        }
    }
    text[kept] = '\0';
    printf("%s\n", text);
}

struct Node *mirror(struct Node *root) {
    // Write your code here
    return root;
}

static char line[16384];

int main(void) {
    fgets(line, sizeof(line), stdin);
    struct Node *root = build_tree(line);
    struct Node *mirrored = mirror(root);
    print_tree(mirrored);
    free_tree(mirrored);
    return 0;
}
