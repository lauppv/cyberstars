int values(struct Node *root, int *found) {
    static struct Node *queue[1024];
    int head = 0;
    int tail = 0;
    if (root != NULL) {
        queue[tail++] = root;
    }
    while (head < tail) {
        struct Node *node = queue[head];
        found[head++] = node->value;
        if (node->left != NULL) {
            queue[tail++] = node->left;
        }
        if (node->right != NULL) {
            queue[tail++] = node->right;
        }
    }
    return tail;
}

bool same_tree(struct Node *first, struct Node *second) {
    static int a[1024];
    static int b[1024];
    int count = values(first, a);
    if (values(second, b) != count) {
        return false;
    }
    for (int i = 0; i < count; i++) {
        if (a[i] != b[i]) {
            return false;
        }
    }
    return true;
}
