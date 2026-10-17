#include <stdio.h>

int val[8], lft[8], rgt[8], count = 0;

int add(int node, int value) {
    if (!node) {
        val[++count] = value;
        return count;
    }
    if (value < val[node]) lft[node] = add(lft[node], value);
    else rgt[node] = add(rgt[node], value);
    return node;
}

void leaves(int node) {
    if (!node) return;
    if (!lft[node] && !rgt[node]) printf(" %d", val[node]);
    leaves(lft[node]);
    leaves(rgt[node]);
}

int main(void) {
    int n, x, target, root = 0;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        scanf("%d", &x);
        root = add(root, x);
    }
    scanf("%d", &target);
    int queue[7], head = 0, tail = 0, level = 0;
    queue[tail++] = root;
    while (head < tail) {
        int size = tail - head;
        printf("Level %d:", level++);
        for (int i = 0; i < size; i++) {
            int node = queue[head++];
            printf(" %d", val[node]);
            if (lft[node]) queue[tail++] = lft[node];
            if (rgt[node]) queue[tail++] = rgt[node];
        }
        printf("\n");
    }
    printf("Leaves:");
    leaves(root);
    printf("\nPath to %d:", target);
    int cur = root;
    while (val[cur] != target) {
        printf(" %d", val[cur]);
        cur = target < val[cur] ? lft[cur] : rgt[cur];
    }
    printf(" %d\n", target);
    return 0;
}
