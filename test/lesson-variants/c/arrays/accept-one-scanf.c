#include <stdio.h>

int main(void) {
    int v[3];
    scanf("%d %d %d", &v[0], &v[1], &v[2]);
    printf("%d\n", (int) (sizeof(v) / sizeof(int)));
    printf("%d\n", *v);
    printf("%d\n", *(v + 2));
    return 0;
}
