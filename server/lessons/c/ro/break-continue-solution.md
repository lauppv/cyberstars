```c
#include <stdio.h>

int main(void) {
    int sigilat, alarma;
    scanf("%d %d", &sigilat, &alarma);

    for (int i = 1; i <= 20; i++) {
        if (i == sigilat) {
            continue;
        }
        if (i == alarma) {
            break;
        }
        printf("%d\n", i);
    }
    return 0;
}
```
