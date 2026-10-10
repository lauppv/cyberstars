#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int n;
    scanf("%d", &n);
    int *v = malloc(n * sizeof(int));
    for (int i = 0; i < n; i++) scanf("%d", &v[i]);
    for (int i = 0; i < n - 1; i++) printf("%d\n", v[i]);
    free(v);
    return 0;
}
