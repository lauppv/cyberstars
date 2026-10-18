struct Node *mirror(struct Node *root) {
    if (root != NULL) {
        root->left = mirror(root->right);
        root->right = mirror(root->left);
    }
    return root;
}
