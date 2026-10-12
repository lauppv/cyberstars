```c
#include <stdio.h>

void triple_it(int *n) {
    *n = *n * 3;
}

int main(void) {
    int signal;
    scanf("%d", &signal);

    triple_it(&signal);
    printf("%d\n", signal);
    return 0;
}
```
