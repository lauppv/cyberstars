int max_depth(struct Node *root) {
    if (root == NULL || (root->left == NULL && root->right == NULL)) {
        return 0;
    }
    int left = max_depth(root->left);
    int right = max_depth(root->right);
    return 1 + (left > right ? left : right);
}
