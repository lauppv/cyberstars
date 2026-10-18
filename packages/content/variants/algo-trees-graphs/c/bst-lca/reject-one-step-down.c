int common_ancestor(struct Node *root, int p, int q) {
    if (p < root->value && q < root->value && root->left != NULL) {
        return root->left->value;
    }
    if (p > root->value && q > root->value && root->right != NULL) {
        return root->right->value;
    }
    return root->value;
}
