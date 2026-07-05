```c
#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);

    // Bucla exterioara: cate linii afisam. Bucla interioara: cate stele per linie.
    for (int linie = 1; linie <= n; linie++) {
        for (int j = 0; j < linie; j++) {
            printf("*");
        }
        printf("\n");
    }

    return 0;
}
```
