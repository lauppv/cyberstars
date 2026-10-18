bool same_tree(struct Node *first, struct Node *second) {
    static struct Node *pairs[2048][2];
    int head = 0;
    int tail = 0;
    pairs[tail][0] = first;
    pairs[tail][1] = second;
    tail++;
    while (head < tail) {
        struct Node *a = pairs[head][0];
        struct Node *b = pairs[head][1];
        head++;
        if (a == NULL && b == NULL) {
            continue;
        }
        if (a == NULL || b == NULL || a->value != b->value) {
            return false;
        }
        pairs[tail][0] = a->left;
        pairs[tail][1] = b->left;
        tail++;
        pairs[tail][0] = a->right;
        pairs[tail][1] = b->right;
        tail++;
    }
    return true;
}
