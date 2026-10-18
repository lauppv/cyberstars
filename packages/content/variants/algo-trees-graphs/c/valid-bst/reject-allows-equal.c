bool fits(struct Node *node, struct Node *low, struct Node *high) {
    if (node == NULL) {
        return true;
    }
    if (low != NULL && node->value < low->value) {
        return false;
    }
    if (high != NULL && node->value > high->value) {
        return false;
    }
    return fits(node->left, low, node) && fits(node->right, node, high);
}

bool is_valid_bst(struct Node *root) {
    return fits(root, NULL, NULL);
}
