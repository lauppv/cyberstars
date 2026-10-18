static int values[512];
static int count = 0;

void collect(struct Node *node) {
    if (node != NULL) {
        collect(node->left);
        values[count++] = node->value;
        collect(node->right);
    }
}

bool is_valid_bst(struct Node *root) {
    collect(root);
    for (int i = 0; i + 1 < count; i++) {
        if (values[i] >= values[i + 1]) {
            return false;
        }
    }
    return true;
}
