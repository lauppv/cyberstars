void print_levels(struct Node *root) {
    static struct Node *queue[1024];
    if (root == NULL) {
        return;
    }
    int head = 0;
    int tail = 0;
    queue[tail++] = root;
    while (head < tail) {
        struct Node *node = queue[head++];
        printf(head == 1 ? "%d" : " %d", node->value);
        if (node->left != NULL) {
            queue[tail++] = node->left;
        }
        if (node->right != NULL) {
            queue[tail++] = node->right;
        }
    }
    printf("\n");
}
