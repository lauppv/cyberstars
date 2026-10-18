```c
bool same_tree(struct Node *first, struct Node *second) {
    if (first == NULL || second == NULL) {
        return first == NULL && second == NULL;
    }
    return first->value == second->value && same_tree(first->left, second->left) &&
           same_tree(first->right, second->right);
}
```
