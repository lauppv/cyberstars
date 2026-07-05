```c
#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);

    // Citim N numere pe rand si numaram cate sunt divizibile cu 2.
    int numar = 0;
    for (int i = 0; i < n; i++) {
        int x;
        scanf("%d", &x);
        if (x % 2 == 0) {
            numar++;
        }
    }

    printf("%d\n", numar);
    return 0;
}
```
