#include <stdio.h>
#include <string.h>

int main(void) {
    int n, count = 0;
    static int items[20000];
    char cmd[16];
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        scanf("%15s", cmd);
        if (strcmp(cmd, "insert") == 0) {
            scanf("%d", &items[count++]);
        } else if (count == 0) {
            puts("Empty");
        } else {
            for (int k = 0; k < count; k++) printf(k ? " %d" : "%d", items[k]);
            putchar('\n');
        }
    }
    return 0;
}
