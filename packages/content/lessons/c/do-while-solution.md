```c
#include <stdio.h>

int main(void) {
    int holes;
    int cards = 0;
    int total = 0;

    do {
        scanf("%d", &holes);
        cards++;
        total = total + holes;
    } while (holes != 0);

    printf("Cards: %d\n", cards);
    printf("Holes: %d\n", total);
    return 0;
}
```
