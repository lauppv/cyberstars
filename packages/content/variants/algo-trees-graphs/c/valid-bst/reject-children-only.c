bool is_valid_bst(struct Node *root) {
    if (root == NULL) {
        return true;
    }
    if (root->left != NULL && root->left->value >= root->value) {
        return false;
    }
    if (root->right != NULL && root->right->value <= root->value) {
        return false;
    }
    return is_valid_bst(root->left) && is_valid_bst(root->right);
}
