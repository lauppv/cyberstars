#include <stdio.h>

int val[8], lft[8], rgt[8], count = 0;

int insert(int node, int value) {
    if (node == 0) {
        val[++count] = value;
        return count;
    }
    if (value < val[node]) lft[node] = insert(lft[node], value);
    else rgt[node] = insert(rgt[node], value);
    return node;
}

void inorder(int node) {
    if (!node) return;
    inorder(lft[node]);
    printf(" %d", val[node]);
    inorder(rgt[node]);
}

int height(int node) {
    if (!node) return -1;
    int l = height(lft[node]), r = height(rgt[node]);
    return 1 + (l > r ? l : r);
}

int search(int node, int target) {
    if (!node) return 0;
    if (val[node] == target) return 1;
    return search(target < val[node] ? lft[node] : rgt[node], target);
}

int main(void) {
    int n, v, target, root = 0;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        scanf("%d", &v);
        root = insert(root, v);
    }
    scanf("%d", &target);
    printf("Sorted:");
    inorder(root);
    printf("\nHeight: %d\n", height(root));
    printf("Search %d: %s\n", target, search(root, target) ? "found" : "not found");
    return 0;
}
