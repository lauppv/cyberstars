#include <stdio.h>
#include <string.h>

int main(void) {
    static long items[20000];
    long *top = items;
    int m;
    char cmd[8];
    scanf("%d", &m);
    while (m-- > 0) {
        scanf("%7s", cmd);
        if (cmd[1] == 'u') {
            scanf("%ld", top++);
        } else if (top == items) {
            puts("Empty");
        } else {
            printf("%ld\n", top[-1]);
            if (strcmp(cmd, "pop") == 0) top--;
        }
    }
    return 0;
}
