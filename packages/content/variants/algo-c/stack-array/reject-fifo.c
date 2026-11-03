#include <stdio.h>
#include <string.h>

int main(void) {
    static int items[20000];
    int head = 0, tail = 0, m;
    char cmd[8];
    scanf("%d", &m);
    for (int i = 0; i < m; i++) {
        scanf("%7s", cmd);
        if (strcmp(cmd, "push") == 0) scanf("%d", &items[tail++]);
        else if (head == tail) puts("Empty");
        else if (strcmp(cmd, "pop") == 0) printf("%d\n", items[head++]);
        else printf("%d\n", items[head]);
    }
    return 0;
}
