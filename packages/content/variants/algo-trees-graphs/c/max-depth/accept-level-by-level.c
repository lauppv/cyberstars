int max_depth(struct Node *root) {
    struct Node *level[512];
    struct Node *next[512];
    int size = 0;
    int levels = 0;
    if (root != NULL) {
        level[size++] = root;
    }
    while (size > 0) {
        int count = 0;
        levels++;
        for (int k = 0; k < size; k++) {
            if (level[k]->left != NULL) next[count++] = level[k]->left;
            if (level[k]->right != NULL) next[count++] = level[k]->right;
        }
        memcpy(level, next, count * sizeof(struct Node *));
        size = count;
    }
    return levels;
}
