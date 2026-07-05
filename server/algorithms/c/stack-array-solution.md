```c
#include <stdio.h>
#include <string.h>

int main(void) {
    int m;
    scanf("%d", &m);

    // Represent the stack as an array + a "top" index telling the last occupied
    // position. top = -1 means empty stack.
    int stack[100];
    int top = -1;

    for (int i = 0; i < m; i++) {
        char cmd[10];
        scanf("%9s", cmd);

        if (strcmp(cmd, "push") == 0) {
            int x;
            scanf("%d", &x);
            top++;
            stack[top] = x;
        } else if (strcmp(cmd, "pop") == 0) {
            if (top == -1) {
                printf("Empty\n");
            } else {
                printf("%d\n", stack[top]);
                top--;
            }
        } else if (strcmp(cmd, "peek") == 0) {
            if (top == -1) {
                printf("Empty\n");
            } else {
                printf("%d\n", stack[top]);
            }
        }
    }

    return 0;
}
```
