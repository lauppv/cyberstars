```c
#include <stdio.h>

void tripleaza(int *n) {
    *n = *n * 3;
}

int main(void) {
    int semnal;
    scanf("%d", &semnal);

    tripleaza(&semnal);
    printf("%d\n", semnal);
    return 0;
}
```
