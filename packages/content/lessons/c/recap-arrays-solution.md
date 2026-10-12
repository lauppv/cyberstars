```c
#include <stdio.h>

int count_passing(int grades[], int n) {
    int total = 0;
    for (int i = 0; i < n; i++) {
        if (grades[i] < 50) {
            continue;
        }
        total = total + 1;
    }
    return total;
}

int find_max(int grades[], int n) {
    int max = grades[0];
    for (int i = 1; i < n; i++) {
        if (grades[i] > max) {
            max = grades[i];
        }
    }
    return max;
}

int find_first_fail(int grades[], int n) {
    int first = -1;
    for (int i = 0; i < n; i++) {
        if (grades[i] < 50) {
            first = grades[i];
            break;
        }
    }
    return first;
}

int main(void) {
    int n;
    scanf("%d", &n);

    int grades[100];
    for (int i = 0; i < n; i++) {
        scanf("%d", &grades[i]);
    }

    printf("Passing: %d\n", count_passing(grades, n));
    printf("Highest: %d\n", find_max(grades, n));
    printf("First fail: %d\n", find_first_fail(grades, n));

    return 0;
}
```
