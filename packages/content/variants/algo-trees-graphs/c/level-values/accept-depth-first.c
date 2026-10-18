static int levels[500][500];
static int count[500];

int collect(struct Node *node, int depth) {
    if (node == NULL) {
        return depth;
    }
    levels[depth][count[depth]++] = node->value;
    int left = collect(node->left, depth + 1);
    int right = collect(node->right, depth + 1);
    return left > right ? left : right;
}

void print_levels(struct Node *root) {
    int depth = collect(root, 0);
    for (int d = 0; d < depth; d++) {
        for (int i = 0; i < count[d]; i++) {
            printf(i == 0 ? "%d" : " %d", levels[d][i]);
        }
        printf("\n");
    }
}
