```c
#include <stdio.h>

int main(void) {
    int draw[3];
    scanf("%d", &draw[0]);
    scanf("%d", &draw[1]);
    scanf("%d", &draw[2]);

    int n = sizeof(draw) / sizeof(draw[0]);

    printf("%d\n", n);
    printf("%d\n", draw[0]);
    printf("%d\n", draw[2]);
    return 0;
}
```
