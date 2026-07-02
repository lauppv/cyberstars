```c
#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);

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
