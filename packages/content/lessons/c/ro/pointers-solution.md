```c
#include <stdio.h>

int main(void) {
    int x;
    scanf("%d", &x);

    int *ptr = &x;
    *ptr = 42;

    printf("%d\n", x);
    printf("%d\n", *ptr);
    return 0;
}
```
