```c
void print_levels(struct Node *root) {
    static struct Node *queue[1024];
    if (root == NULL) {
        return;
    }
    int head = 0;
    int tail = 0;
    queue[tail++] = root;
    while (head < tail) {
        int level_end = tail;
        while (head < level_end) {
            struct Node *node = queue[head++];
            printf("%d%s", node->value, head < level_end ? " " : "\n");
            if (node->left != NULL) {
                queue[tail++] = node->left;
            }
            if (node->right != NULL) {
                queue[tail++] = node->right;
            }
        }
    }
}
```
