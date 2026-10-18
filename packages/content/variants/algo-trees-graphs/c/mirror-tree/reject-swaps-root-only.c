struct Node *mirror(struct Node *root) {
    if (root != NULL) {
        struct Node *left = root->left;
        root->left = root->right;
        root->right = left;
    }
    return root;
}
