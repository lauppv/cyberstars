```c
int max_depth(struct Node *root) {
    if (root == NULL) {
        return 0;
    }
    int left = max_depth(root->left);
    int right = max_depth(root->right);
    if (left > right) {
        return 1 + left;
    }
    return 1 + right;
}
```
