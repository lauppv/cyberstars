```c
#include <stdio.h>

int main(void) {
    int gauri;
    int cartele = 0;
    int total = 0;

    do {
        scanf("%d", &gauri);
        cartele++;
        total = total + gauri;
    } while (gauri != 0);

    printf("Cartele: %d\n", cartele);
    printf("Gauri: %d\n", total);
    return 0;
}
```
