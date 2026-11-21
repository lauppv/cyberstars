```c
#include <stdio.h>
#include <string.h>

int longest(int v[], int n) {
    int best = v[0];
    for (int i = 1; i < n; i++) {
        if (v[i] > best) {
            best = v[i];
        }
    }
    return best;
}

int main(void) {
    char name[32];
    int n;
    int hours[50];
    int total = 0;
    scanf("%31s %d", name, &n);
    for (int i = 0; i < n; i++) {
        scanf("%d", &hours[i]);
        total = total + hours[i];
    }

    printf("%s (%d letters)\n", name, (int)strlen(name));
    printf("Shifts: %d\n", n);
    printf("Hours: %d\n", total);
    printf("Longest shift: %d\n", longest(hours, n));
    return 0;
}
```
