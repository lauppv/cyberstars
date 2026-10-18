int max_depth(struct Node *root) {
    int depth = 0;
    while (root != NULL) {
        depth++;
        root = root->left;
    }
    return depth;
}
