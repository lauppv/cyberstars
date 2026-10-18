static int values[512];
static int count = 0;

void collect(struct Node *node) {
    if (node != NULL) {
        values[count++] = node->value;
        collect(node->left);
        collect(node->right);
    }
}

int compare(const void *a, const void *b) {
    return *(const int *)a - *(const int *)b;
}

int kth_smallest(struct Node *root, int k) {
    collect(root);
    qsort(values, count, sizeof(int), compare);
    return values[k - 1];
}
