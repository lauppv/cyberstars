int common_ancestor(struct Node *root, int p, int q) {
    struct Node *node = root;
    while (1) {
        if (p <= node->value && q <= node->value) {
            node = node->left;
        } else if (p >= node->value && q >= node->value) {
            node = node->right;
        } else {
            return node->value;
        }
    }
}
