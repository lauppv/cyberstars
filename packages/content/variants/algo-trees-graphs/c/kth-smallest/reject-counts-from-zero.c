int kth_smallest(struct Node *root, int k) {
    static struct Node *stack[512];
    int top = 0;
    struct Node *node = root;
    while (1) {
        while (node != NULL) {
            stack[top++] = node;
            node = node->left;
        }
        if (top == 0) {
            return 0;
        }
        node = stack[--top];
        if (k == 0) {
            return node->value;
        }
        k--;
        node = node->right;
    }
}
