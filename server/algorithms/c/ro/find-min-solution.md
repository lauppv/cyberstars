```c
#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);

    // Presupunem ca primul numar este minimul, apoi comparam cu restul.
    // Daca gasim ceva mai mic, actualizam minimul.
    int minim;
    scanf("%d", &minim);

    for (int i = 1; i < n; i++) {
        int x;
        scanf("%d", &x);
        if (x < minim) {
            minim = x;
        }
    }

    printf("%d\n", minim);
    return 0;
}
```
