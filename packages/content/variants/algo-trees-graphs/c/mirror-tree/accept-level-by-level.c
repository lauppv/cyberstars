struct Node *mirror(struct Node *root) {
    static struct Node *queue[1024];
    int head = 0;
    int tail = 0;
    if (root != NULL) {
        queue[tail++] = root;
    }
    while (head < tail) {
        struct Node *node = queue[head++];
        struct Node *left = node->left;
        node->left = node->right;
        node->right = left;
        if (node->left != NULL) {
            queue[tail++] = node->left;
        }
        if (node->right != NULL) {
            queue[tail++] = node->right;
        }
    }
    return root;
}
