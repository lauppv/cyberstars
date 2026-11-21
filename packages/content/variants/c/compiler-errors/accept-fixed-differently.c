#include <stdio.h>
#include <string.h>

int longest(int v[], int n) {
    int best = v[0];
    for (int i = 1; i < n; i++)
        best = v[i] > best ? v[i] : best;
    return best;
}

int main(void) {
    char name[32];
    int n, hours[50], total = 0;
    scanf("%31s %d", name, &n);
    for (int i = 0; i < n; i++) {
        scanf("%d", &hours[i]);
        total += hours[i];
    }
    printf("%s (%zu letters)\nShifts: %d\nHours: %d\nLongest shift: %d\n", name, strlen(name), n, total, longest(hours, n));
    return 0;
}
