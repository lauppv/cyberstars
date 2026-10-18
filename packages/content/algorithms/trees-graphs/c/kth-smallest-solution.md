```c
int kth_smallest(struct Node *root, int k) {
    static struct Node *stack[512];
    int top = 0;
    struct Node *node = root;
    while (1) {
        while (node != NULL) {
            stack[top++] = node;
            node = node->left;
        }
        node = stack[--top];
        k--;
        if (k == 0) {
            return node->value;
        }
        node = node->right;
    }
}
```
