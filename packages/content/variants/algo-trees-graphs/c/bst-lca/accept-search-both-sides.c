struct Node *find(struct Node *node, int p, int q) {
    if (node == NULL || node->value == p || node->value == q) {
        return node;
    }
    struct Node *left = find(node->left, p, q);
    struct Node *right = find(node->right, p, q);
    if (left != NULL && right != NULL) {
        return node;
    }
    return left != NULL ? left : right;
}

int common_ancestor(struct Node *root, int p, int q) {
    return find(root, p, q)->value;
}
