#include <stdio.h>

int main(void) {
    char line[21] = {0};
    int n;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        line[i] = '*';
        puts(line);
    }
    return 0;
}
