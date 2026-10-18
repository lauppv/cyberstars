static int values[512];
static int count = 0;

void walk(struct Node *node) {
    if (node != NULL) {
        values[count++] = node->value;
        walk(node->left);
        walk(node->right);
    }
}

int kth_smallest(struct Node *root, int k) {
    walk(root);
    return values[k - 1];
}
