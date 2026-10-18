```c
struct Node *mirror(struct Node *root) {
    if (root == NULL) {
        return NULL;
    }
    struct Node *left = mirror(root->left);
    root->left = mirror(root->right);
    root->right = left;
    return root;
}
```
