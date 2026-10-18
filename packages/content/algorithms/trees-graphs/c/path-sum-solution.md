```c
bool has_path_sum(struct Node *root, int target) {
    if (root == NULL) {
        return false;
    }
    int rest = target - root->value;
    if (root->left == NULL && root->right == NULL) {
        return rest == 0;
    }
    return has_path_sum(root->left, rest) || has_path_sum(root->right, rest);
}
```
