bool has_path_sum(struct Node *root, int target) {
    static struct Node *stack[1024];
    static int sums[1024];
    int top = 0;
    if (root != NULL) {
        stack[top] = root;
        sums[top++] = root->value;
    }
    while (top > 0) {
        top--;
        struct Node *node = stack[top];
        int total = sums[top];
        if (node->left == NULL && node->right == NULL && total == target) {
            return true;
        }
        if (node->left != NULL) {
            stack[top] = node->left;
            sums[top++] = total + node->left->value;
        }
        if (node->right != NULL) {
            stack[top] = node->right;
            sums[top++] = total + node->right->value;
        }
    }
    return false;
}
