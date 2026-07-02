```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int n;
    scanf("%d", &n);

    int *citiri = malloc(n * sizeof(int));
    for (int i = 0; i < n; i++) {
        scanf("%d", &citiri[i]);
    }

    for (int i = 0; i < n; i++) {
        printf("%d\n", citiri[i]);
    }

    free(citiri);
    return 0;
}
```
