```c
#include <stdio.h>

struct Banda {
    char eticheta[50];
    int an;
    int metri;
};

int main(void) {
    struct Banda benzi[2];

    for (int i = 0; i < 2; i++) {
        scanf("%s %d %d", benzi[i].eticheta, &benzi[i].an, &benzi[i].metri);
    }

    for (int i = 0; i < 2; i++) {
        printf("%s (%d) - %d m\n", benzi[i].eticheta, benzi[i].an, benzi[i].metri);
    }
    return 0;
}
```
