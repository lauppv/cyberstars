#include <stdio.h>

int main(void) {
    int a = 1;
    int b = 2;
    int c = 3;
    int d = 4;
    int e = 5;
    int f = 6;
    int g = 7;
    int val[8] = {0, a, b, c, d, e, f, g};
    int lft[8] = {0, 2, 4, 5, 0, 0, 0, 0};
    int rgt[8] = {0, 3, 0, 6, 0, 7, 0, 0};
    int queue[7], head = 0, tail = 0, level = 0;
    queue[tail++] = 1;
    while (head < tail) {
        int size = tail - head;
        printf("Level %d:", level++);
        for (int i = 0; i < size; i++) {
            int n = queue[head++];
            printf(" %d", val[n]);
            if (lft[n]) queue[tail++] = lft[n];
            if (rgt[n]) queue[tail++] = rgt[n];
        }
        printf("\n");
    }
    return 0;
}
