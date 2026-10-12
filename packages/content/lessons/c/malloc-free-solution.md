```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int n;
    scanf("%d", &n);

    int *readings = malloc(n * sizeof(int));
    for (int i = 0; i < n; i++) {
        scanf("%d", &readings[i]);
    }

    for (int i = 0; i < n; i++) {
        printf("%d\n", readings[i]);
    }

    free(readings);
    return 0;
}
```
