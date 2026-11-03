#include <stdio.h>
#include <string.h>

int main(void) {
    static int items[20000];
    int top = 0, m;
    char cmd[8];
    scanf("%d", &m);
    for (int i = 0; i < m; i++) {
        scanf("%7s", cmd);
        if (strcmp(cmd, "push") == 0) scanf("%d", &items[top++]);
        else if (top == 0) puts("Empty");
        else printf("%d\n", items[--top]);
    }
    return 0;
}
