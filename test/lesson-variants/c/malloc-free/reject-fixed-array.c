#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);
    int values[1000];
    for (int i = 0; i < n; i++) scanf("%d", &values[i]);
    for (int i = 0; i < n; i++) printf("%d\n", values[i]);
    return 0;
}
