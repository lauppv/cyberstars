```c
#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);

    for (int i = 0; i < n; i++) {
        long numar;
        scanf("%ld", &numar);
        if (numar > 0 && (numar & (numar - 1)) == 0) {
            printf("YES\n");
        } else {
            printf("NO\n");
        }
    }

    return 0;
}
```
