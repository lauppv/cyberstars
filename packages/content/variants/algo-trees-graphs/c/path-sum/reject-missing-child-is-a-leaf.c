bool has_path_sum(struct Node *root, int target) {
    if (root == NULL) {
        return target == 0;
    }
    int rest = target - root->value;
    return has_path_sum(root->left, rest) || has_path_sum(root->right, rest);
}
